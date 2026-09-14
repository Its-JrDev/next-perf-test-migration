import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Sube un nivel para situarse en la raíz del proyecto (/riwi-react-perf-test)
const ROOT_DIR = path.resolve(__dirname, '..');

const COMMENT = '/* eslint-disable react-refresh/only-export-components */\n';

function runEslintJson() {
  try {
    console.log(' Ejecutando ESLint en src/components...');
    // Ejecutamos eslint apuntando a la carpeta de componentes con formato JSON
    const output = execSync('npx eslint src/components --format json', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'], // Captura el stdout limpio sin romper el flujo por errores de linting
    });
    return JSON.parse(output);
  } catch (error) {
    // execSync lanza una excepción si ESLint encuentra problemas (code > 0).
    // Capturamos el stdout que contiene el JSON con los resultados.
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch (parseError) {
        console.error(
          '❌ Error al parsear el JSON de ESLint:',
          parseError.message,
        );
        return [];
      }
    }
    console.error('❌ Error crítico al ejecutar ESLint:', error.message);
    return [];
  }
}

function processEslintResults() {
  const results = runEslintJson();
  let addedCount = 0;
  let removedCount = 0;

  if (!results || results.length === 0) {
    console.log(' No se encontraron reportes de ESLint en src/components.');
    return;
  }

  results.forEach((result) => {
    const filePath = result.filePath;

    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Condición 1: El archivo arroja el error de fast-refresh
    const hasRefreshIssue = result.messages.some(
      (msg) =>
        msg.ruleId === 'react-refresh/only-export-components' ||
        msg.code === 'react-refresh/only-export-components',
    );

    // Condición 2: El archivo arroja la directiva obsoleta/sin usar
    const hasUnusedDirective = result.messages.some(
      (msg) =>
        msg.message &&
        msg.message.includes(
          "Unused eslint-disable directive (no problems were reported from 'react-refresh/only-export-components')",
        ),
    );

    // ACCIÓN 1: Añadir el comentario si el linter reclama el componente y no está puesto
    if (hasRefreshIssue && !content.startsWith(COMMENT)) {
      fs.writeFileSync(filePath, COMMENT + content, 'utf8');
      console.log(` Añadido en: ${path.relative(ROOT_DIR, filePath)}`);
      addedCount++;
    }

    // ACCIÓN 2: Quitar el comentario si el linter avisa que ya no se usa
    else if (hasUnusedDirective && content.startsWith(COMMENT)) {
      const updatedContent = content.replace(COMMENT, '');
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(` Quitado de: ${path.relative(ROOT_DIR, filePath)}`);
      removedCount++;
    }
  });

  console.log(`\n Proceso terminado.`);
  console.log(`   Añadidos: ${addedCount}`);
  console.log(`   Quitados: ${removedCount}`);
}

processEslintResults();

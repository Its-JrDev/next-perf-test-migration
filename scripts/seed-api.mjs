import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const accessToken = process.env.SEED_ACCESS_TOKEN;
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!apiUrl) {
  throw new Error('Define NEXT_PUBLIC_API_URL (por ejemplo, http://localhost:3000).');
}

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method ?? 'GET'} ${path}: ${response.status} ${body}`);
  }

  return response.status === 204 ? undefined : response.json();
}

async function getToken() {
  if (accessToken) return accessToken;
  if (!email || !password) {
    throw new Error(
      'Define SEED_ACCESS_TOKEN o SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD.',
    );
  }

  const auth = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return auth.accessToken;
}

const categoriesToSeed = [
  ['Seed · Música', 'Conciertos, sesiones en vivo y festivales.'],
  ['Seed · Arte y cultura', 'Exposiciones, cine, teatro y actividades culturales.'],
  ['Seed · Gastronomía', 'Experiencias culinarias, ferias y degustaciones.'],
  ['Seed · Deportes', 'Encuentros deportivos y actividades al aire libre.'],
  ['Seed · Tecnología', 'Charlas, talleres y comunidades tecnológicas.'],
  ['Seed · Bienestar', 'Yoga, salud, meditación y autocuidado.'],
  ['Seed · Familia', 'Planes y talleres para todas las edades.'],
  ['Seed · Negocios', 'Networking, emprendimiento y conferencias.'],
];

const eventThemes = [
  'Encuentro de comunidad',
  'Taller práctico',
  'Festival local',
  'Conversatorio abierto',
  'Experiencia de fin de semana',
  'Sesión al atardecer',
  'Laboratorio creativo',
  'Mercado y muestra',
  'Ruta urbana',
  'Jornada especial',
];

const imageSources = [
  'https://images.unsplash.com/photo-1506157786151-b8491531f063',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b',
];

function eventImages(eventNumber, count) {
  return Array.from({ length: count }, (_, imageIndex) => {
    const source = imageSources[(eventNumber + imageIndex) % imageSources.length];
    return `${source}?auto=format&fit=crop&w=1200&q=80&sig=${eventNumber}-${imageIndex + 1}`;
  });
}

async function main() {
  const token = await getToken();
  const authorization = { Authorization: `Bearer ${token}` };
  const profile = await request('/users/me', { headers: authorization });

  if (profile.role !== 'admin') {
    throw new Error('El JWT proporcionado no pertenece a un administrador.');
  }

  const existingCategories = await request('/categories');
  const categories = [];

  for (const [name, description] of categoriesToSeed) {
    let category = existingCategories.find((item) => item.name === name);
    if (!category) {
      category = await request('/categories', {
        method: 'POST',
        headers: authorization,
        body: JSON.stringify({ name, description }),
      });
      console.log(`Categoría creada: ${name}`);
    }
    categories.push(category);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (let index = 0; index < 50; index += 1) {
    const number = index + 1;
    const category = categories[index % categories.length];
    const name = `PlanCity Seed · ${eventThemes[index % eventThemes.length]} ${String(number).padStart(2, '0')}`;
    const found = await request(`/events?search=${encodeURIComponent(name)}`);

    const existingEvent = found.find((event) => event.name === name);
    const imageCount = index % 4;
    const images = eventImages(number, imageCount);

    if (existingEvent) {
      const needsImageRefresh = existingEvent.images?.some((image) =>
        image.url.includes('picsum.photos'),
      );
      if (needsImageRefresh) {
        await request(`/events/${existingEvent.id}`, {
          method: 'PATCH',
          headers: authorization,
          body: JSON.stringify({ images }),
        });
        updated += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    const date = new Date(Date.UTC(2026, 8, 1 + index, 18 + (index % 4), 0));

    await request('/events', {
      method: 'POST',
      headers: authorization,
      body: JSON.stringify({
        name,
        description: `Evento de prueba persistido en base de datos para ${category.name.replace('Seed · ', '')}.`,
        date: date.toISOString(),
        location: `Espacio PlanCity ${number}, Bogotá`,
        price: index % 5 === 0 ? 0 : 15000 + (index % 6) * 5000,
        capacity: 40 + (index % 8) * 20,
        categoryId: category.id,
        images,
      }),
    });
    created += 1;
  }

  console.log(
    `Seed finalizado. Eventos creados: ${created}; imágenes actualizadas: ${updated}; sin cambios: ${skipped}.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

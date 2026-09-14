# PlanCity — Prueba de Desempeño Módulo Typescript-React

**SuperApp** está lanzando **PlanCity**, su nueva vertical para descubrir y organizar eventos y actividades locales (conciertos, talleres, eventos deportivos, etc.). El equipo de backend ya construyó y dejó funcionando la API REST (NestJS + PostgreSQL) que maneja usuarios con roles, categorías de evento, eventos y favoritos, con autenticación por JWT.

Este proyecto es la interfaz frontend que consume correctamente esa API, respetando las reglas de negocio que ya existen en el servidor. No es un frontend abstracto: es una integración contra un backend real, con sus mismas reglas y sus mismos errores.

## Autor

**Jose D. Romero** - [@Its-JrDev](https://github.com/Its-JrDev)

## Objetivo

Construir una interfaz web utilizando React, TypeScript y Next.js que consuma la API REST de PlanCity (ya construida y en funcionamiento) para la gestión de eventos y actividades locales.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 + shadcn/ui |
| Routing | Next.js App Router (rutas por archivo) |
| Estado | React Context + Hooks |
| HTTP Client | Axios |
| Iconos | Lucide React |
| Notificaciones | Sonner |
| Formularios | Zod (validación) |
| Tablas | Tanstack Table |
| Testing | Vitest + Testing Library |
| Calidad de código | ESLint + Prettier |

## Arquitectura del Proyecto

### Arquitectura Basada en Tipos + Diseño Atómico

Este proyecto combina dos patrones complementarios:

1. **Arquitectura Basada en Tipos** (organización horizontal): Los archivos se agrupan según su responsabilidad técnica — `components/`, `hooks/`, `services/`, `types/`, etc. Es el patrón tradicional en frameworks como React, Angular o Express.

2. **Diseño Atómico** (organización vertical dentro de componentes): Los componentes UI siguen una jerarquía de complejidad creciente: átomos → moléculas → organismos → templates.

```
src/
├── components/
│   ├── atoms/          # Elementos base indivisibles (Button, Input, Badge)
│   ├── molecules/      # Composiciones simples (Card, Popover, ProfileMenu)
│   ├── organisms/      # Componentes complejos con lógica (AppHeader, Sidebar, EventCard)
│   ├── templates/      # Templates de página (AppShell, EventsTemplate)
│   └── guards/         # AuthGuard, GuestGuard, RoleGuard (client)
├── app/                # App Router (Next.js): rutas por archivo + route groups
│   ├── (public)/       # Login y Register (sin shell)
│   ├── (shell)/        # Área autenticada con AppShell (layout persistente)
│   └── ...             # not-found, forbidden, layouts y providers
├── types/              # Definiciones TypeScript centralizadas
├── hooks/              # Custom hooks reutilizables
├── services/           # Capa de API (axios + servicios por dominio)
├── contexts/           # Estado global (AuthContext, FavoritesContext)
├── providers/          # Proveedores de contexto
├── screens/            # Componentes de página (usados por las rutas del App Router)
├── utils/              # Utilidades (cn para tailwind-merge + clsx)
├── styles/             # Temas y estilos globales
└── config/             # Configuración (axios.config con NEXT_PUBLIC_API_URL)
```

### ¿Por qué esta combinación?

Este proyecto fue construido en **~7 horas** como entrega de una prueba de desempeño. La decisión de combinar ambos patrones se justifica así:

**Arquitectura Basada en Tipos — ¿Por qué?**

- **Velocidad de desarrollo**: No hay tiempo que perder diseñando módulos de negocio. Saber que todos los hooks van en `hooks/`, los servicios en `services/`, y los tipos en `types/` permite escribir código inmediatamente.
- **Curva de aprendizaje cero**: El revisor o cualquier developer que lea el proyecto entiende la estructura al instante. No hay convenciones personalizadas que memorizar.
- **Ubicación predecible**: En un desarrollo contra reloj, si necesitas un servicio vas a `services/`, si necesitas un tipo vas a `types/`.

**Diseño Atómico — ¿Por qué?**

- **Reutilización inmediata**: Los átomos (Button, Input, Badge) se reutilizan en todas las moléculas y organismos sin duplicar código.
- **Consistencia visual**: Al tener building blocks definidos, toda la UI mantiene coherencia sin esfuerzo adicional.
- **Escalabilidad de componentes**: Agregar nuevas vistas es rápido porque se componen de piezas ya existentes.

### Trade-offs aceptados

| Ventaja aprovechada | Trade-off aceptado |
|---------------------|-------------------|
| Desarrollo inmediato | Posible fragmentación futura de features entre carpetas |
| Estructura ubicable | Cambio de contexto entre carpetas al modificar una feature |
| Reutilización de átomos | Overhead de abstracción en componentes muy simples |
| Sin overhead de diseño de dominio | No escala tan bien como Domain-Driven en proyectos grandes |

## Decisiones de Diseño

### ¿Por qué shadcn/ui?

shadcn/ui no es una biblioteca tradicional que se instala vía npm como dependencia. En su lugar, los componentes se copian directamente al proyecto, lo que significa:

- **Control total**: Cada componente es tuyo. Puedes modificarlo sin esperar PRs ni luchar con APIs restrictivas.
- **Sin sobrecarga de dependencias**: Solo usas lo que necesitas. Radix UI como primitiva accesible, Tailwind para estilos.
- **Consistencia**: Todos los componentes siguen el mismo patrón de diseño basado en CVA (class-variance-authority) para variantes.

### ¿Por qué Axios?

- **Interceptores**: Permite centralizar la lógica de tokens JWT (inyección automática del header `Authorization` y manejo de 401).
- **Mejor manejo de errores**: A diferencia de `fetch`, Axios lanza errores en respuestas 4xx/5xx, simplificando el try/catch.
- **Cancelación de requests**: Importante para evitar race conditions en búsquedas y filtros.
- **Transformación de datos**: Serialización/deserialización automática.

### ¿Por qué Next.js App Router (en lugar de React Router)?

- **Rutas por archivo**: Convención de carpetas y archivos (`page.tsx`, `layout.tsx`) dentro de `src/app`, con route groups (`(public)`, `(shell)`) para organizar áreas sin contaminar la URL.
- **Layouts persistentes**: El shell (Sidebar + Header) vive en un layout que no se re-monta entre rutas.
- **Guards declarativos**: `AuthGuard`, `GuestGuard` y `RoleGuard` se mantienen como wrappers client dentro de cada página, usando `next/navigation` para redirección.
- **Navegación**: `next/link` y `useRouter`, con code-splitting y optimización por ruta (SSG/SSR automático).

### ¿Sidebar a la izquierda o a la derecha por vista?

El layout `(shell)` usa un único `AppShell` que decide el lado del sidebar según la ruta activa, sin duplicar layouts ni carpetas:

- **`src/components/templates/AppShell.tsx`** deriva el lado con `usePathname()`:
  ```ts
  const side: 'left' | 'right' =
    pathname === '/' || pathname.startsWith('/events') ? 'left' : 'right';
  ```
  Cualquier ruta no incluida cae en `right` (hoy: `/categories*` y `/favorites`).
- **`src/components/organisms/Sidebar.tsx`** recibe `position?: 'left' | 'right'` (por defecto `'left'`) y conmuta su borde interno (`border-r` ↔ `border-l`).
- En desktop, `AppShell` reposiciona el sidebar dentro del flex con `order-last`/`order-first` (sin tocar el sticky y el colapso de ancho). En móvil, el drawer se desliza desde `left-0`/`-translate-x-full` o `right-0`/`translate-x-full`.

**Para cambiar el reparto** solo se edita el `ternary` de `side` en `AppShell.tsx` (decisión por prefijo de ruta). Como las páginas son estáticas, el HTML prerenderizado ya trae el lado correcto, evitando flash de hidratación.

### ¿Por qué Tailwind CSS 4?

- **Rendimiento**: Compila solo las clases que usas, generando CSS mínimo.
- **DX**: Elimina el contexto-switching entre archivos. Los estilos viven junto al markup.
- **Configuración como CSS**: La v4 usa directivas nativas de CSS (`@import 'tailwindcss'`), simplificando la configuración.
- **Utilidad `cn()`**: Combinamos `clsx` + `tailwind-merge` para resolver conflictos de clases condicionales.

### ¿Por qué React Context + Hooks en lugar de Redux/Zustand?

Para una app de este alcance, Context es suficiente y evita dependencias adicionales. Los proveedores están separados por dominio (`AuthProvider`, `FavoritesProvider`) para minimizar re-renders.

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Next.js) |
| `npm run build` | Compila para producción (Turbopack) |
| `npm run start` | Sirve el build de producción |
| `npm run typecheck` | Verificación de tipos (tsc --noEmit) |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | ESLint con auto-fix |
| `npm run format` | Formatea código con Prettier |
| `npm run format:check` | Verifica formato sin modificar |
| `npm run test` | Tests en modo watch (Vitest) |
| `npm run test:run` | Tests una sola vez |
| `npm run ui:add` | Agrega componentes shadcn al proyecto |
| `npm run ui:normalize` | Normaliza imports (`src/` → `@/`) y gestiona directivas ESLint |
| `npm run seed:api` | Pobla la API con datos de prueba (requiere .env) |

### Razón de los Scripts Custom

- **`ui:normalize`**: shadcn genera componentes con imports relativos (`../../../utils/cn`). Este script los convierte a alias (`@/utils/cn`) para mantener limpio el código. También gestiona automáticamente la directiva `eslint-disable react-refresh/only-export-components` que shadcn requiere en archivos barrel.

- **`seed-api`**: Pobla la base de datos con datos de prueba para desarrollo.

### ¿Cómo funciona el seed?

El script `scripts/seed-api.mjs` automatiza la creación de datos de prueba en la API:

1. **Autenticación**: Lee las credenciales desde `.env` (token directo o email/password para login)
2. **Verificación de rol**: Confirma que el JWT pertenece a un usuario con rol `admin`
3. **Creación de categorías**: Inserta 8 categorías temáticas (Música, Arte, Gastronomía, Deportes, etc.) si no existen
4. **Creación de eventos**: Genera 50 eventos distribuidos en las categorías con:
   - Nombres temáticos (ej: "PlanCity Seed · Taller práctico 01")
   - Fechas escaladas a partir de septiembre 2026
   - Precios variables (algunos gratuitos)
   - Capacidades entre 40 y 180 asistentes
   - Imágenes de Unsplash con signatures únicas por evento
5. **Idempotencia**: Si un evento ya existe, solo actualiza sus imágenes si detecta URLs obsoletas (e. j: picsum.photos)

```bash
# Variables requeridas en .env
NEXT_PUBLIC_API_URL=http://localhost:3000
SEED_ACCESS_TOKEN=tu_jwt          # O usa email/password:
SEED_ADMIN_EMAIL=admin@mail.com
SEED_ADMIN_PASSWORD=admin123

# Ejecutar
npm run seed:api
```

## Configuración del Entorno

Crea un archivo `.env` en la raíz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
SEED_ACCESS_TOKEN=tu_jwt_token_opcional
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=admin123
```

## Cómo Ejecutar

```bash
# Clonar
git clone https://github.com/jrangel98/riwi-react-perf-test.git
cd riwi-react-perf-test

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar desarrollo
npm run dev

# (Opcional) Poblar API con datos de prueba
npm run seed:api
```

## Características

- **Autenticación JWT**: Login/Register con persistencia de sesión
- **Roles**: Vista diferenciada para `user` y `admin`
- **CRUD completo**: Eventos y categorías (admin)
- **Favoritos**: Toggle de favoritos por usuario
- **Búsqueda**: Command palette (Cmd+K) para navegación rápida
- **Paginación**: Con selector de items por página
- **Temas**: Light/Dark con el preset "Desert Sands"
- **Responsive**: Sidebar colapsable + drawer móvil
- **Toasts**: Notificaciones con Sonner
- **Protección de rutas**: Guards por auth y por rol

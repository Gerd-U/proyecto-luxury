# Residencias La Guaria

Aplicación web y móvil para promocionar residencias de lujo en Costa Rica. Permite explorar un catálogo de 25 propiedades, filtrarlas, ver su detalle, guardar favoritas y solicitar información o una visita.

**Universidad de Costa Rica · Sede de Occidente, Recinto de Tacares**
Desarrollo de Software IV · Proyecto #1 · II Ciclo 2026

## Enlaces

| | |
|---|---|
| Sitio publicado (Vercel) | [COMPLETAR] |
| Repositorio | https://github.com/Gerd-U/proyecto-luxury |
| Evidencia en Android | [COMPLETAR] |

## Equipo

| Integrante | Responsabilidad principal |
|---|---|
| Gerald José Urbina Quesada | Estilos CSS, identidad visual y diseño responsivo |
| Marvin Vinicio Castro Gonzalez | Catálogo de apartamentos y componentes de interfaz (UI) |
| Luis Felipe Ortega Bolaños | Página de inicio, páginas y enrutamiento |

## Descripción

Residencias La Guaria presenta un catálogo de apartamentos, penthouses y casas en venta en el Valle Central y el Pacífico de Costa Rica. El visitante puede:

- Navegar por todas las páginas sin que el sitio se recargue (SPA).
- Buscar y filtrar residencias, y recorrer el catálogo de 5 en 5.
- Abrir la ficha completa de cada residencia, con galería de fotos.
- Marcar favoritas y recuperarlas aunque cierre o recargue la página.
- Completar un formulario de contacto con validaciones.

La misma base de código genera la versión web y la versión Android (Capacitor).

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev) | Interfaz basada en componentes y hooks |
| [TypeScript 6](https://www.typescriptlang.org) | Tipado estático (sin `any`) |
| [Vite 8](https://vite.dev) | Servidor de desarrollo y compilación (plantilla `react-ts`) |
| [React Router 7](https://reactrouter.com) | Rutas, ruta dinámica y parámetros de URL |
| CSS tradicional | Estilos propios, sin Tailwind ni Bootstrap |
| ESLint + typescript-eslint | Calidad del código |
| [Capacitor](https://capacitorjs.com) | Empaquetado Android |
| [Vercel](https://vercel.com) | Publicación de la versión web |

Tipografías (Google Fonts): Cormorant Garamond para títulos y Jost para texto.

## Funcionalidades

**Páginas y rutas**

| Ruta | Página |
|---|---|
| `/` | Inicio: introducción animada, presentación, propuesta de valor y residencias destacadas |
| `/apartamentos` | Catálogo con búsqueda, filtros y paginación |
| `/apartamentos/:id` | Detalle de una residencia (ruta dinámica) |
| `/favoritos` | Residencias guardadas por el usuario |
| `/contacto` | Formulario de contacto o solicitud de visita |
| `*` | Página 404 para rutas inexistentes |

**Catálogo y datos**
- 25 residencias en `public/data/apartments.json`, cargadas con `fetch` desde un hook personalizado (`useApartments`).
- Paginación de 5 residencias por página.
- Estados de carga (esqueleto), error (con botón para reintentar) y sin resultados.
- Cada residencia muestra nombre, ubicación, precio, imagen, descripción, habitaciones, baños, área y amenidades.

**Filtros**
- Búsqueda por texto (nombre, zona y amenidades; ignora mayúsculas y tildes).
- Filtro por zona, con un mapa de Costa Rica y selección por región.
- Filtro por número mínimo de habitaciones.
- Filtro por precio máximo.
- Los filtros y la página se guardan en la URL, por lo que se conservan al volver desde un detalle y se pueden compartir.
- Los resultados se calculan sin modificar el arreglo original.

**Favoritos**
- Agregar y quitar favoritos desde las tarjetas y el detalle.
- Compartidos con Context API y guardados en `localStorage`, por lo que persisten al recargar.
- Opción de deshacer al quitar un favorito.

**Formulario de contacto**
- Formulario controlado: nombre, correo, teléfono (opcional), propiedad de interés y mensaje.
- Validación de campos obligatorios, formato de correo y longitud mínima del mensaje, con el error junto a cada campo.
- Si se abre desde el detalle de una residencia, el campo de propiedad llega prellenado (`?propiedad=`).
- **El envío es simulado:** no existe un backend y la información no sale del navegador.

**Navegación y accesibilidad**
- Menú responsivo con botón de apertura y cierre, sección activa resaltada y cierre automático al elegir una opción.
- HTML semántico, etiquetas `aria`, textos alternativos y respeto a la preferencia de movimiento reducido.

## Instalación y uso

**Requisitos:** [Node.js](https://nodejs.org) 22 (LTS) o superior y npm.

```bash
git clone https://github.com/Gerd-U/proyecto-luxury.git
cd proyecto-luxury
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Revisa los tipos (`tsc -b`) y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión compilada |
| `npm run lint` | Ejecuta ESLint |

## Versión Android (Capacitor)

La app Android usa la carpeta `dist` generada por Vite (`webDir: dist`).

Requisitos: [Android Studio](https://developer.android.com/studio) con un SDK de Android y un emulador o un teléfono con depuración USB.

```bash
npm install
npm run build          # genera dist/
npx cap sync android   # copia dist/ al proyecto Android
npx cap open android   # abre Android Studio
```

Desde Android Studio, pulsa **Run** sobre el emulador o el dispositivo. Para generar un APK de prueba: **Build > Build APK(s)**.

Configuración (`capacitor.config.ts`): `appId` `[COMPLETAR: com.laguaria.residencias]` y `appName` `[COMPLETAR: Residencias La Guaria]`.

## Publicación en Vercel

El proyecto se publica desde la rama `[COMPLETAR]` con el comando `npm run build` y la carpeta de salida `dist`. El archivo `vercel.json` redirige todas las rutas a `index.html`, para que las rutas de la SPA (por ejemplo `/apartamentos/3`) funcionen también al recargar el navegador.

## Estructura del proyecto

```
public/
├── data/apartments.json      # catálogo de 25 residencias
└── images/                   # fotos locales de cada residencia
src/
├── components/
│   ├── layout/               # Header, Footer, Layout, ScrollToTop
│   ├── home/                 # Hero, BrandIntro, IntroLoader, ValueProposition, FeaturedApartments
│   ├── apartments/           # ApartmentCard, ApartmentList, FilterBar, CostaRicaMap,
│   │                         # FavoriteButton, KeyFacts, ApartmentGallery, ApartmentCardSkeleton
│   ├── brand/                # BrandMark (logotipo)
│   └── ui/                   # Pagination, Loader, ErrorMessage, EmptyState, SocialIcon
├── pages/                    # una carpeta por ruta (Home, Apartments, ApartmentDetail, Favorite, Contact, NotFound)
├── router/AppRouter.tsx      # todas las rutas dentro de <Layout />
├── context/FavoriteContext.tsx
├── hooks/                    # useApartments, useInView, useScrolled, useIntroLoader
├── utils/                    # filterApartments, paginate, formatPrice, region, isApartment, viewTransition
├── types/                    # Apartment, ApartmentFilters, tipos del mapa y del footer
├── data/costaRicaMap.ts      # contorno y puntos del mapa
└── styles/global.css         # variables y estilos globales
```

## Datos

Cada residencia en `public/data/apartments.json` tiene la forma de la interfaz `Apartment` (`src/types/apartment.ts`):

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador único (se usa en la ruta `/apartamentos/:id`) |
| `name` | texto | Nombre de la residencia |
| `location` | texto | Ubicación con el formato «Zona, Provincia» |
| `price` | número | Precio de venta en dólares |
| `image` | texto | Foto principal |
| `gallery` | lista de textos | Fotos del recorrido (opcional) |
| `description` | texto | Descripción |
| `bedrooms`, `bathrooms` | número | Habitaciones y baños |
| `area` | número | Área en m² |
| `amenities` | lista de textos | Amenidades |
| `featured` | booleano | Si aparece en las destacadas de Inicio (opcional) |

Los datos de las residencias son de ejemplo y se usan con fines académicos. 

## Decisiones técnicas

- **Un solo hook para los datos:** `useApartments` hace el único `fetch` del proyecto, valida el JSON con la función `isApartment` (type guard sobre `unknown`, sin `any`), guarda una caché en memoria y expone `apartments`, `isLoading`, `error` y `retry`.
- **La URL como fuente de verdad del catálogo:** los filtros y la página se leen con `useSearchParams`, en lugar de guardarse en `useState`.
- **Context API** para los favoritos, con persistencia en `localStorage` y lectura validada.
- **Componentes controlados** en el formulario y en la barra de filtros, con el estado en el componente padre.
- **Mejora progresiva:** la transición de la foto entre la tarjeta y el detalle usa la API View Transitions solo cuando el navegador la soporta y el usuario no pidió movimiento reducido.

## Identidad visual

- **Nombre y logotipo:** la guaria morada es la flor nacional de Costa Rica; el logotipo (`BrandMark`) está inspirado en ella.
- **Paleta:** ciruela `#2b0f29`, guaria `#74196b`, pétalo `#c066ae`, arena `#f5ebdd` y verde `#4e8f6b`. Los tonos profundos y la arena cálida transmiten sobriedad y lujo.
- **Tipografías:** una serif de contraste (Cormorant Garamond) para los títulos y una sans geométrica (Jost) para el texto.

## Flujo de trabajo con Git

Se trabajó con una rama por integrante (`Gerald`, `Felipe`, `Vinicio`). Los cambios entran a `develop` mediante Pull Requests, y `develop` es la rama de integración.
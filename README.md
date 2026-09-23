# Kder Odontología — propuesta

Landing estática en español (HTML, CSS y JavaScript, sin dependencias ni build), con el mismo formato que la propuesta de Napas: hero, tratamientos, mapa de sedes, cobertura, pasos, preguntas frecuentes, formulario a WhatsApp, asistente de turnos y una animación de scroll (un cepillo recorre el diente y lo deja limpio).

## Vista local

```sh
python3 -m http.server 8000 --directory dist
```

Abrir http://localhost:8000. El mapa requiere conexión a Internet.

## Publicar en Vercel

Importar este repositorio en Vercel con Framework Preset **Other**, Build Command vacío, Output Directory **dist**.

## Archivos

- `dist/index.html`: contenido y estructura.
- `dist/style.css`: estilos y diseño adaptable.
- `dist/app.js`: mapa de sedes (`sedes`), consulta de obra social y formulario de turno.
- `dist/journey.js`: animación del diente con el scroll.
- `dist/motion.js`: aparición de bloques al scrollear y cintas del cierre que se aceleran con el scroll.
- `dist/bot.js`: asistente de turnos; las preguntas se editan en `BOT_CONFIG.steps`.
- `dist/style.css`: las paletas están al inicio, como variables (`--brand`, `--accent`, `--deep-1..4`, etc.) bajo `html[data-palette=…]`.
- `dist/fonts/`: tipografías propias (Fraunces, Bricolage Grotesque, Newsreader y Onest, licencia SIL OFL). La barra de propuesta tiene selectores de tipografía (A/B/C) y de paleta (menta, océano, lavanda, salvia) para comparar; al elegir la definitiva, quitar el selector y las fuentes que no se usen.
- Leaflet incluido en `dist` (licencia en `leaflet-LICENSE.txt`).

## Material para compartir

- `material/kder-recorrido.mp4`: video vertical de ~50 s recorriendo el sitio (paletas, secciones, asistente de turnos) para mandar por WhatsApp.
- `dist/og-image.jpg`: vista previa del link (1200×630). Las etiquetas `og:` en `index.html` apuntan a `https://kder-odontologia.vercel.app`; si el dominio es otro, actualizar `og:url`, `og:image` y `twitter:image`.
- Sección de reseñas (`#resenas`): los botones abren Google Maps. Para la versión final, reemplazarlos por el enlace “Pedir reseñas” del Perfil de Empresa de Google de cada sede.

## Datos a confirmar con el consultorio

Tomados de directorios públicos, no verificados con Kder:

- WhatsApp 341 612-1290 (`5493416121290`), usado en todos los botones.
- Sedes: Centro 9 de Julio 1161 (tel. 440-9138 / 448-2955), Sur Av. del Rosario 1138 (463-7430), Norte Av. Alberdi 266 (438-4539). Coordenadas del mapa aproximadas; “Cómo llegar” busca la dirección en Google Maps.
- Tratamientos: odontología general, endodoncia, odontopediatría, prótesis y ortodoncia.
- Faltan horarios, lista de obras sociales, fotos y profesionales.

Se mantiene `noindex` mientras sea una propuesta. Las ilustraciones son conceptuales.

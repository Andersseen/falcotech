# FalcoTech

Web de FalcoTech en AnalogJS 2.9 y Angular 21. El servidor Nitro renderiza la web y procesa el formulario de contacto.

## Desarrollo

Con Node.js 22.13+ (o 24) y pnpm 10:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

La web se abre en http://localhost:5173. Para probar la compilación de producción localmente:

```sh
pnpm check
pnpm build
pnpm preview
```

Copia `.env.example` a `.env` y configura `RESEND_API_KEY` para habilitar el envío local. En Cloudflare se guarda como secret del Worker (ver *Despliegue*). El formulario envía un `POST /api/contact`. El servidor valida los campos y usa Resend para enviar el mensaje a `info@falcotech.es` (`CONTACT_TO`). El remitente se cambia con `CONTACT_FROM`; su dominio tiene que estar verificado en Resend.

### Protección del formulario

- Las reglas de validación están en `src/shared/contact.ts` y las usan el cliente y el servidor.
- El servidor rechaza peticiones de otro origen (403) y cuerpos de más de 16 KB (413). También limita a 5 envíos cada 15 minutos por IP (429). El límite vive en memoria de cada instancia y por eso es orientativo en serverless y en Workers.
- Un campo trampa (`website`) descarta bots simples: el servidor responde éxito sin enviar nada.
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) es opcional. Crea un widget con la acción `contact`, define `VITE_TURNSTILE_SITE_KEY` en la build y `TURNSTILE_SECRET` y `TURNSTILE_HOSTNAMES` en el servidor. Sin esas variables, el formulario funciona sin el reto.
- Sin JavaScript, el formulario se envía igualmente. El servidor redirige de vuelta con `?contact=sent|error|limited` y la página muestra el resultado.
- Todas las respuestas llevan cabeceras de seguridad (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`).

```sh
pnpm test
```

Para generar el artefacto de Vercel en local, ejecuta `BUILD_PRESET=vercel pnpm build`. Nitro lo deja en `.vercel/output`.

## Despliegue

La web de producción actual (www.falcotech.es) sigue en Vercel, desplegada desde GitLab. Este repositorio se despliega en paralelo en Cloudflare Workers hasta cambiar de proveedor.

- El workflow `.github/workflows/ci.yml` verifica cada cambio (`check`, `test`, build con `BUILD_PRESET=cloudflare_module`, `agents:check`) y después despliega:
  - **Pull request:** una versión de preview en `https://pr-<número>-falcotech.<subdominio>.workers.dev`, enlazada en un comentario del PR. No toca el tráfico de producción.
  - **Push a `main`** o ejecución manual (*Run workflow*): producción en `https://falcotech.<subdominio>.workers.dev`.
- Secrets del repositorio en GitHub: `CLOUDFLARE_API_TOKEN` (permiso *Workers Scripts: Edit*) y `CLOUDFLARE_ACCOUNT_ID`.
- Los secrets del servidor se guardan en el Worker y los comparten producción y previews: `pnpm exec wrangler secret put RESEND_API_KEY` (y `TURNSTILE_SECRET` si se usa Turnstile).
- La configuración está en `wrangler.jsonc`. Nitro la combina en `dist/analog/server/wrangler.json`, que es el fichero que se despliega.
- Para probarlo en local dentro de workerd: `pnpm build:cloudflare && pnpm preview:cloudflare` (http://localhost:8787).
- Despliegue desde tu máquina (necesita `pnpm exec wrangler login` una vez, o `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el entorno):
  - `pnpm deploy:preview`: sube una versión de preview en `https://local-falcotech.<subdominio>.workers.dev` sin tocar producción.
  - `pnpm deploy:prod`: despliega producción.
  - No se llama `pnpm deploy` porque ese nombre es un comando interno de pnpm.
- Las previews de versión necesitan que el Worker exista: el primer despliegue de producción se hace a mano con *Run workflow* sobre esta rama.
- Solo `www.falcotech.es` se indexa (`PRODUCTION_HOSTS` en `src/server/site.ts`). Cualquier otro host, incluidos `workers.dev` y las previews, responde con `X-Robots-Tag: noindex` y un `robots.txt` que bloquea todo.
- Para el cambio de proveedor: añadir `falcotech.es` como zona en Cloudflare (o un custom domain del Worker), apuntar el DNS de Raiola y quitar el dominio del proyecto de Vercel.

## SEO y metadatos

- Etyma gestiona `<html lang>`, la URL canónica y los `hreflang` de cada idioma.
- `src/app/seo/page-seo.ts` escribe en el servidor el título, la descripción, Open Graph, la Twitter card, `robots` y los datos estructurados `Organization` (JSON-LD). Cada página lo declara con `injectPageMeta()`. La 404 lleva `noindex`.
- Los textos están en `meta.*` de cada catálogo, y los datos de la empresa en `src/app/seo/site.ts`.
- `/robots.txt` y `/sitemap.xml` se generan en el servidor con el origen de la petición. Las páginas publicadas se listan en `src/server/site.ts`. Fuera de `www.falcotech.es`, `robots.txt` bloquea la indexación.
- La imagen para redes sociales es `public/og-image.jpg` (1200×630).

## Imágenes

- Los originales están en `images/`. `pnpm images` genera variantes WebP de 160 a 2560 px en `src/assets/img/` (nunca más anchas que el original) y un `manifest.json` con sus tamaños.
- Las páginas las pintan con `NgOptimizedImage` y un loader propio (`src/app/media/images.ts`). Así cada imagen lleva `srcset` y `sizes`, carga en diferido y, la del hero, se precarga con `fetchpriority="high"` desde el HTML del servidor.
- Para cambiar o añadir una foto, copia el mejor original que tengas en `images/` y ejecuta `pnpm images`. La nitidez depende del original: algunas fotos actuales (p-8, p-10, p-11) son pequeñas y están muy comprimidas.

## Librerías de Andersseen

| Librería | Uso en la web |
| --- | --- |
| Etyma Core, Angular y Analog | Catálogos tipados, traducción en SSR, `lang`, canonical y `hreflang` por idioma. Español en `/`, inglés en `/en` y catalán en `/ca`. |
| Volt UI | Todos los átomos de interfaz: `voltButton` en botones y enlaces nativos, `VoltToggle` (tema), `VoltSelect` (idioma), `VoltCard` (servicios y contacto), `VoltAccordion`, formulario (`VoltFormField`, `VoltInput`, `VoltTextarea`, `VoltError`, `VoltAlert`, `VoltSpinner`), `VoltDialogRoot` (galería), cajón móvil, `VoltTooltip` en los botones de solo icono, `VoltEmptyState` (404) y `VoltSeparator`. El tema claro/oscuro se aplica con `applyVoltTheme`. |
| Lumen Icons | Todos los iconos, importados uno a uno desde `lumen-icons/<icono>`. Los fondos redondos de los iconos de servicio y de la 404 los dibuja Lumen (`background`, `tone`, `padding`, `radius`). |
| Angular Movement | Entradas al hacer scroll (`moveInView` + `moveStagger`), fundido cruzado del carrusel (`*movePresenceFor`), aparición y salida del botón "volver arriba" (`*movePresence`), galería (`moveEnter` escalonado y `moveWhileHover`), respuesta táctil (`moveWhileTap="press"`), revelado circular del tema (`MoveAnimator` sobre una View Transition) y la foto de las especialidades (`moveSpringValue`). Los valores por defecto están en `provideMovement()`. |

Criterio de animación: Movement se encarga de entradas, salidas, presencia, gestos y secuencias imperativas. CSS se queda con lo que ya se ve en el primer pintado (la entrada del texto del hero, como recomienda Movement), con los estados de hover/foco de los átomos y con la transición de columnas de las tarjetas de servicio, que interpola `grid-template-columns`.

## Codex y Claude Code

Las convenciones del proyecto para agentes están en `AGENTS.md`; `CLAUDE.md` lo importa. La CI (`.github/workflows/ci.yml`) ejecuta `check`, `test`, `build` y `agents:check`.

[Agentyx](https://github.com/Andersseen/agentyx) está fijado a la versión del proyecto. La configuración activa los packs `technical`, `typescript` y `angular` para ambos agentes, con sus skills locales y el MCP de documentación Context7.

```sh
pnpm agents:check
```

Si cambias `.agentyx.json`, revisa el plan con `pnpm exec agentyx sync --dry-run`, aplica el cambio con `pnpm agents:sync` y guarda también el lock y los archivos generados en el repositorio.

[Volt UI] también está instalado para Codex y Claude Code, con siete skills por agente y el servidor MCP para consultar el catálogo de componentes.

```sh
pnpm exec volt-ui-agent doctor codex claude
```

El instalador del proyecto es `pnpm exec volt-ui-agent codex claude --yes`. Tras actualizarlo, ejecuta `pnpm agents:sync` para normalizar la configuración compartida con Agentyx.

[Volt UI]: https://voltui.dev/docs/mcp

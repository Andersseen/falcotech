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

Copia `.env.example` a `.env` y configura `RESEND_API_KEY` para habilitar el envío local. En Vercel, configura esa variable en el entorno del proyecto. El formulario envía un `POST /api/contact`. El servidor valida los campos y usa Resend para enviar el mensaje a `info@falcotech.es` (`CONTACT_TO`). El remitente se cambia con `CONTACT_FROM`; su dominio tiene que estar verificado en Resend.

### Protección del formulario

- Las reglas de validación están en `src/shared/contact.ts` y las usan el cliente y el servidor.
- El servidor rechaza peticiones de otro origen (403) y cuerpos de más de 16 KB (413). También limita a 5 envíos cada 15 minutos por IP (429). El límite vive en memoria y por eso es orientativo en serverless.
- Un campo trampa (`website`) descarta bots simples: el servidor responde éxito sin enviar nada.
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) es opcional. Crea un widget con la acción `contact`, define `VITE_TURNSTILE_SITE_KEY` en la build y `TURNSTILE_SECRET` y `TURNSTILE_HOSTNAMES` en el servidor. Sin esas variables, el formulario funciona sin el reto.
- Sin JavaScript, el formulario se envía igualmente. El servidor redirige de vuelta con `?contact=sent|error|limited` y la página muestra el resultado.
- Todas las respuestas llevan cabeceras de seguridad (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`).

```sh
pnpm test
```

Para generar el artefacto de Vercel en local, ejecuta `BUILD_PRESET=vercel pnpm build`. Nitro lo deja en `.vercel/output`.

## SEO y metadatos

- Etyma gestiona `<html lang>`, la URL canónica y los `hreflang` de cada idioma.
- `src/app/seo/page-seo.ts` escribe en el servidor el título, la descripción, Open Graph, la Twitter card, `robots` y los datos estructurados `Organization` (JSON-LD). Cada página lo declara con `injectPageMeta()`. La 404 lleva `noindex`.
- Los textos están en `meta.*` de cada catálogo, y los datos de la empresa en `src/app/seo/site.ts`.
- `/robots.txt` y `/sitemap.xml` se generan en el servidor con el origen de la petición. Las páginas publicadas se listan en `src/server/site.ts`. En los previews de Vercel, `robots.txt` bloquea la indexación.
- La imagen para redes sociales es `public/og-image.jpg` (1200×630).

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

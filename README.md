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

## Librerías de Andersseen

| Librería | Uso en la web |
| --- | --- |
| Etyma Core, Angular y Analog | Catálogos tipados, traducción en SSR y metadatos por idioma. Español en `/`, inglés en `/en` y catalán en `/ca`. |
| Angular Movement | Entrada de la portada y animación al entrar en pantalla de las tarjetas y especialidades. |
| Volt UI | `VoltButton` para acciones, `VoltToggle` para el tema, `VoltSelect` para el idioma y `VoltDialogRoot` para la galería y el menú móvil. Tarjetas, acordeón y formulario usan los componentes Volt. Los enlaces conservan su semántica con la directiva `voltButton`. |
| Lumen Icons | Iconos de la aplicación importados individualmente desde `lumen-icons/<icono>` para que el bundle incluya solo los usados. |

## Codex y Claude Code

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

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

Copia `.env.example` a `.env` y configura `RESEND_API_KEY` para habilitar el envío local. En Vercel, configura esa variable en el entorno del proyecto. El formulario envía un `POST /api/contact`. El servidor valida los campos y usa Resend para enviar el mensaje a `info@falcotech.es`.

Para generar el artefacto de Vercel en local, ejecuta `BUILD_PRESET=vercel pnpm build`. Nitro lo deja en `.vercel/output`.

## Librerías de Andersseen

| Librería | Uso en la web |
| --- | --- |
| Etyma Core, Angular y Analog | Catálogos tipados, traducción en SSR y metadatos por idioma. Español en `/`, inglés en `/en` y catalán en `/ca`. |
| Angular Movement | Entrada de la portada y animación al entrar en pantalla de las tarjetas y especialidades. |
| Quartz Headless Primitives | Comportamiento y accesibilidad del acordeón de control de fauna. |

## Codex y Claude Code

[Agentyx](https://github.com/Andersseen/agentyx) está fijado a la versión del proyecto. La configuración activa los packs `technical`, `typescript` y `angular` para ambos agentes, con sus skills locales y el MCP de documentación Context7.

```sh
pnpm agents:check
```

Si cambias `.agentyx.json`, revisa el plan con `pnpm exec agentyx sync --dry-run`, aplica el cambio con `pnpm agents:sync` y guarda también el lock y los archivos generados en el repositorio.

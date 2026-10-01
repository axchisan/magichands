# Magic H4nds — notas para agentes

Web y catálogo para Magic H4nds (crochet, Vélez, Santander), preparada como propuesta para la dueña.
Leer primero `README.md` (estado) y `docs/08-plan-de-desarrollo.md` (qué sigue).

## Reglas del proyecto

- **Precios**: los fija ella. No mostrar ni sugerir precios propios; `mostrarPrecios` sigue en `false`
  hasta que ella los confirme. El precio de venta del proyecto ($300.000) es interno: no va en la web.
- **Privacidad**: `recursos/instagram/` (local, fuera de git) contiene datos bancarios de ella en
  `historias-destacadas/11_informacion/003.jpg`. Nunca copiar esos datos a docs, código ni commits.
  No usar fotos de clientes ni de terceros sin su permiso.
- **No inventar** hechos del negocio: solo lo que ella publicó (ver `investigacion/`).
- **Dominio portable**: nada de URLs fijas en el código; todo sale de variables (`docs/09-dominio-portable.md`).
- Recursos ajenos que no se tocan: proyecto Vercel `axchisan-com`, bucket R2 `axchisan-media`,
  proyecto Neon `axchisan`, registros DNS `api` y `gastos` de `axchisan.com`.

## Código

- App en `web/` (Next.js 16: leer `web/AGENTS.md` y `node_modules/next/dist/docs/` antes de escribir código).
- Antes de fusionar a `main`: `cd web && npm run check`.
- `main` se publica solo en Vercel (`magichands.axchisan.com`).

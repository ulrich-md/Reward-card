# Reward Card

Tarjetas de sellos y cupones digitales para negocios. El cliente escanea un QR en
el mostrador, crea su tarjeta con nombre y celular, y el personal le da un sello
en cada visita escaneando el QR de la tarjeta.

## Pantallas

| Ruta | Para quién | Qué hace |
|---|---|---|
| `/` | Agencia y negocios | Entrada única. Con la contraseña de la agencia abre `/admin`; con el código de un negocio abre `/panel`. |
| `/admin` | Agencia | Alta de negocios, códigos de acceso, cupones, clientes, actividad y cartel. |
| `/panel` | Dueño del negocio | El panel de su negocio y solo el suyo: clientes, cupones, cartel y PIN. |
| `/j/[negocio]` | Cliente final | Alta: nombre + celular. Con el mismo celular recupera su tarjeta. |
| `/c/[token]` | Cliente final | Su tarjeta: sellos, QR, recompensas y cupones. Se actualiza sola. |
| `/s/[negocio]` | Personal | Escáner con cámara (o búsqueda por código/celular). Entra con el PIN del local. |
| `/presentacion` | Agencia | Página de presentación del producto, con demo interactiva. |
| `/paleta` | Diseño | Sistema de color y tipografía. |

Todas las pantallas se adaptan a móvil y escritorio. El fondo es claro; lo
importante va en un panel de grafito con grano y el brillo del color del negocio,
y el resto en tarjetas blancas. Tipografías: Bricolage Grotesque (titulares y
cifras), Hanken Grotesk (interfaz), Instrument Serif (énfasis) y JetBrains Mono
(datos). Iconos de Lucide; los negocios eligen su sello de un juego de iconos.

La skill de diseño `ui-ux-pro-max` está instalada en `.claude/skills/` (licencia
MIT, de nextlevelbuilder/ui-ux-pro-max-skill).

## Desarrollo

```bash
npm install
npm run dev
```

Sin configurar nada, usa una base de datos embebida en `.data/` con un negocio
de prueba. Credenciales locales:

| Quién | Dónde | Contraseña |
|---|---|---|
| Agencia | `/` | `admin` |
| Dueño de «Café Demo» | `/` | `DEMO-CAFE-2026` |
| Personal de «Café Demo» | `/s/cafe-demo` | `1234` |

El negocio de prueba no se crea nunca en la base de Supabase.

## Producción (Vercel + Supabase)

1. Crea un proyecto en Supabase y copia la cadena de conexión del *Transaction pooler*.
2. Crea las tablas: `DATABASE_URL=... npm run db:setup`
3. En Vercel define `DATABASE_URL`, `ADMIN_PASSWORD` y `SESSION_SECRET` (ver `.env.example`).

## Apple Wallet y Google Wallet

La emisión de tarjetas está detrás de una interfaz (`src/lib/wallet/index.ts`).
Para la demo hay un proveedor, Pass Studio (`src/lib/wallet/passstudio.ts`), que
se activa al definir `PASS_STUDIO_API_KEY`; después aparece el botón «Activar
tarjeta de Wallet» en cada negocio.

**Esa integración todavía no se ha probado contra la API real** (está escrita a
partir de su documentación). Sin clave, todo funciona con la tarjeta web.

El plan es sustituirlo por Google Wallet directo y certificado propio de Apple
añadiendo otro proveedor que cumpla la misma interfaz.

## Reglas del programa

- Al completar la tarjeta, los sellos vuelven a cero y se suma una recompensa por canjear.
- Una misma tarjeta no puede recibir dos sellos en menos de 30 segundos.
- Cada cliente puede usar cada cupón una sola vez.

## Pendiente

- Puntos y niveles (fase 2).
- Verificar el celular con un código (hoy cualquiera que conozca un número puede abrir esa tarjeta).
- Auto-registro de negocios y cobro de suscripción (fase 3).

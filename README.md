# Reward Card

Tarjetas de sellos y cupones digitales para negocios. El cliente escanea un QR en
el mostrador, crea su tarjeta con nombre y celular, y el personal le da un sello
en cada visita escaneando el QR de la tarjeta.

## Pantallas

| Ruta | Para quién | Qué hace |
|---|---|---|
| `/admin` | Agencia | Alta de negocios, cupones, clientes y actividad. Entra con `ADMIN_PASSWORD`. |
| `/j/[negocio]` | Cliente | Alta: nombre + celular. Con el mismo celular recupera su tarjeta. |
| `/c/[token]` | Cliente | Su tarjeta: sellos, QR, recompensas y cupones. Se actualiza sola. |
| `/s/[negocio]` | Personal | Escáner con cámara (o búsqueda por código/celular). Entra con el PIN del local. |

## Desarrollo

```bash
npm install
npm run dev
```

Sin configurar nada, usa una base de datos embebida en `.data/` y la contraseña
del panel es `admin`.

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

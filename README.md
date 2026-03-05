# 🏍️ EnduroCommunity

Plataforma web de comunidad de eventos deportivos de motor (enduro, motocross, trial, etc.).

**Stack:** Next.js 15 · TypeScript · TailwindCSS · Netlify Identity · Netlify Blobs · Netlify

---

## 🚀 Deploy en Netlify (paso a paso)

### 1. Habilita Netlify Identity

En el panel de tu sitio en Netlify → **Site configuration** → **Identity** → **Enable Identity**.

Opcionalmente, en **Registration preferences** elige *Invite only* para mayor seguridad.

### 2. Variables de entorno

En **Site settings** → **Environment variables**, añade:

| Variable | Valor |
|---|---|
| `BOOTSTRAP_ADMIN_EMAIL` | `jeremyagnz@gmail.com` (o tu email) |
| `NEXT_PUBLIC_SITE_URL` | URL de tu sitio (ej: `https://tu-sitio.netlify.app`) |

> **`BOOTSTRAP_ADMIN_EMAIL`**: La primera vez que ese email inicie sesión con Netlify Identity, se le asignará automáticamente el rol de `admin` en la base de datos de Netlify Blobs.

### 3. Deploy

1. Conecta el repositorio en Netlify (**Add new site** → **Import from Git**)
2. Netlify detecta el `netlify.toml` automáticamente:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Haz clic en **Deploy site** 🎉

### 4. Hazte admin (primera vez)

1. Registra la cuenta con el email configurado en `BOOTSTRAP_ADMIN_EMAIL` usando el botón **Registrarse** de la cabecera
2. Inicia sesión — el sistema te asignará automáticamente el rol `admin` en tu primer login
3. Navega a `/admin` para acceder al panel de administración

### 5. Gestión de roles (API)

Para asignar el rol `admin` a otro usuario manualmente:

```bash
# Primero obtén el JWT del usuario admin (desde el widget de Identity en el navegador)
# Luego llama al endpoint:
curl -X PUT https://tu-sitio.netlify.app/api/admin/users/<USER_ID>/role \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

---

## 🗄️ Persistencia con Netlify Blobs

Los datos se almacenan en **Netlify Blobs** (storage serverless de Netlify) en el store `ja-sorteos-db`:

| Clave | Contenido |
|---|---|
| `users.json` | Array de usuarios con id, email, full_name, role |
| `events.json` | Array de eventos con todos sus campos |

**Importante:** Netlify Blobs persiste entre deploys y es accesible únicamente desde las funciones serverless del sitio.

---

## 💻 Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

> **Nota:** En desarrollo local, las API routes que usan Netlify Blobs fallarán si no se ejecutan dentro del contexto de Netlify (p.ej. con `netlify dev`). Para desarrollo local, instala la CLI de Netlify:
>
> ```bash
> npm install -g netlify-cli
> netlify dev
> ```

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Login y registro (páginas informativas)
│   ├── (main)/          # Home (lista de eventos) y detalle de evento
│   ├── admin/           # Panel admin protegido por AdminGuard
│   │   ├── events/      # CRUD de eventos
│   │   ├── registrations/ # Placeholder
│   │   └── users/       # Placeholder
│   ├── api/
│   │   ├── me/          # GET /api/me — upsert usuario y retorna rol
│   │   ├── events/      # GET (público) / POST (admin)
│   │   │   └── [id]/    # GET (público) / PUT/DELETE (admin)
│   │   └── admin/users/[id]/role/  # PUT — asignar rol (admin)
│   └── layout.tsx       # Carga netlify-identity-widget
├── components/
│   ├── ui/              # Botones, inputs, cards...
│   ├── events/          # EventCard, EventForm
│   ├── layout/          # Header (con Netlify Identity), Footer
│   └── admin/           # AdminNav, AdminGuard
├── lib/
│   ├── db/blobs.ts      # Data access layer — Netlify Blobs
│   ├── auth/identity.ts # Helpers JWT de Netlify Identity
│   ├── utils.ts         # Helpers de formato
│   └── validations.ts   # Validaciones de formularios
├── types/index.ts
└── middleware.ts        # Mínimo (sin Supabase)
netlify.toml             # Configuración de deploy
```

---

## ✨ Funcionalidades

| Característica | Descripción |
|---|---|
| 🔐 Auth modal | Login/signup con Netlify Identity widget (modal) |
| 👥 Roles | Admin y usuario, comprobados server-side vía JWT |
| 📅 CRUD Eventos | Crear, listar, editar y eliminar eventos |
| 🛡️ Panel Admin | Dashboard, gestión de eventos |
| 🔒 AdminGuard | Protección client-side del panel admin |
| 🗄️ Netlify Blobs | Base de datos JSON persistente sin Supabase |


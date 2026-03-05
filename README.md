# 🏍️ EnduroCommunity

Plataforma web de comunidad de eventos deportivos de motor (enduro, motocross, trial, etc.).

**Stack:** Next.js 14 · TypeScript · TailwindCSS · Supabase · Netlify

---

## 🚀 Deploy en Netlify (paso a paso)

### 1. Crea tu proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Elige un nombre, región (p.ej. West EU) y contraseña de base de datos
3. Espera a que se cree el proyecto (~1 min)

### 2. Configura la base de datos

En tu proyecto de Supabase, ve a **SQL Editor** y ejecuta estos archivos **en orden**:

1. `supabase/schema.sql` — crea tablas, triggers y políticas RLS
2. Registra una cuenta en la app, luego ejecuta `supabase/seed.sql` — inserta 8 eventos de ejemplo

### 3. Crea el bucket de imágenes

En Supabase → **Storage** → **New bucket**:
- Nombre: `event-images`
- ✅ Public bucket: activado

Luego en **Policies** del bucket añade:
- `SELECT` → `true` (acceso público)
- `INSERT` → `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`
- `DELETE` → `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`

### 4. Obtén las API keys

En Supabase → **Project Settings** → **API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Deploy en Netlify

1. Ve a [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Conecta tu repositorio GitHub (`JA-Sorteos`)
3. Netlify detecta automáticamente la configuración del `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. En **Site settings** → **Environment variables**, añade:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

5. Haz clic en **Deploy site** 🎉

### 6. Hazte admin

Después del primer deploy, regístrate en la app y luego en Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu@email.com';
```

Ahora tendrás acceso al **Panel Admin** en `/admin`.

---

## 💻 Desarrollo local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus keys de Supabase

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Login y registro
│   ├── (main)/          # Home (lista de eventos) y detalle de evento
│   ├── admin/           # Panel admin protegido
│   │   ├── events/      # CRUD de eventos
│   │   ├── registrations/
│   │   └── users/
│   └── layout.tsx
├── components/
│   ├── ui/              # Botones, inputs, cards...
│   ├── events/          # EventCard, EventForm, RegisterButton
│   ├── auth/            # LoginForm, RegisterForm
│   ├── layout/          # Header, Footer
│   └── admin/           # AdminNav
├── lib/
│   ├── supabase/        # client.ts, server.ts, middleware.ts
│   ├── utils.ts         # Helpers de formato
│   └── validations.ts   # Validaciones de formularios
├── types/index.ts
└── middleware.ts        # Protección de rutas
supabase/
├── schema.sql           # Esquema de BD + RLS
└── seed.sql             # 8 eventos de ejemplo
netlify.toml             # Configuración de deploy
```

---

## ✨ Funcionalidades

| Característica | Descripción |
|---|---|
| 🔐 Auth completa | Registro, login, logout con Supabase Auth |
| 👥 Roles | Admin y usuario, protegidos en middleware y servidor |
| 📅 CRUD Eventos | Crear, listar, editar y eliminar eventos |
| 🖼️ Subida imágenes | Upload a Supabase Storage desde el panel admin |
| ✅ Inscripciones | Los usuarios se inscriben y cancelan desde el evento |
| 🛡️ Panel Admin | Dashboard con estadísticas, eventos, inscripciones y usuarios |
| 🔒 RLS | Políticas de seguridad a nivel de base de datos |

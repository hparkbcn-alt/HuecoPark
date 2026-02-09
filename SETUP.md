# 🅿️ huecoPark - Plataforma de Reserva de Estacionamientos

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version` y `npm --version`

2. **Git** (opcional, para control de versiones)
   - Descarga desde: https://git-scm.com/

## 🚀 Instalación Rápida

### Paso 1: Instalar Node.js

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS (Long Term Support)**
3. Ejecuta el instalador y sigue los pasos
4. Reinicia tu terminal/PowerShell
5. Verifica: `node --version` (debe mostrar v18.x.x o superior)

### Paso 2: Instalar Dependencias

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install
```

Esto puede tomar varios minutos la primera vez.

### Paso 3: Configurar Base de Datos MongoDB

**Opción A: MongoDB Atlas (Gratis, en la nube) - RECOMENDADO**

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (elige el plan FREE)
4. En "Security" → "Database Access":
   - Crea un usuario con contraseña
   - Guarda el usuario y contraseña
5. En "Security" → "Network Access":
   - Añade "0.0.0.0/0" para permitir acceso desde cualquier IP
6. En "Deployment" → "Database" → Click en "Connect":
   - Selecciona "Connect your application"
   - Copia la Connection String
   - Reemplaza `<password>` con tu contraseña
   - Ejemplo: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/huecopark?retryWrites=true&w=majority`

7. Pega esta URL en el archivo `.env.local` en la variable `DATABASE_URL`

**Opción B: MongoDB Local**

1. Descarga MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Instala y ejecuta MongoDB
3. Usa esta URL en `.env.local`: `DATABASE_URL="mongodb://localhost:27017/huecopark"`

### Paso 4: Actualizar .env.local

Abre el archivo `.env.local` y actualiza:

```env
DATABASE_URL="mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/huecopark?retryWrites=true&w=majority"
```

### Paso 5: Inicializar la Base de Datos

```powershell
npx prisma generate
npx prisma db push
```

### Paso 6: Ejecutar el Proyecto

```powershell
npm run dev
```

El proyecto estará disponible en: http://localhost:3000

## ✅ Verificación del Setup

Si todo está correcto, deberías poder:

1. ✅ Ver la página principal con el logo "huecoPark"
2. ✅ Ver las categorías de estacionamiento
3. ✅ Hacer clic en "Registrarse" y crear una cuenta
4. ✅ Iniciar sesión con email y contraseña

## 🔧 Solución de Problemas

### Error: "npm no se reconoce como comando"
- **Solución**: Necesitas instalar Node.js primero (ver Paso 1)

### Error: "Cannot connect to MongoDB"
- **Solución**: Verifica que tu `DATABASE_URL` en `.env.local` sea correcta
- Asegúrate de que el usuario y contraseña no tengan caracteres especiales sin escapar
- Verifica que permites conexiones desde cualquier IP en MongoDB Atlas

### Error: "Prisma Client not generated"
- **Solución**: Ejecuta `npx prisma generate`

### Error: "Module not found"
- **Solución**: Ejecuta `npm install` nuevamente

### El puerto 3000 está en uso
- **Solución**: Detén el otro proceso o cambia el puerto:
  ```powershell
  $env:PORT=3001; npm run dev
  ```

## 📦 Funcionalidades Disponibles (Sin Configuración Adicional)

✅ **Registro e Inicio de Sesión** (con email/contraseña)
✅ **Publicar Estacionamientos**
✅ **Buscar y Filtrar Parkings**
✅ **Sistema de Favoritos**
✅ **Ver Mis Parkings**

## 🔒 Funcionalidades Opcionales (Requieren Configuración)

### GitHub OAuth (Opcional)
1. Ve a: https://github.com/settings/developers
2. Crea una nueva OAuth App
3. Añade las credenciales a `.env.local`:
   ```env
   GITHUB_CLIENT_ID="tu-client-id"
   GITHUB_CLIENT_SECRET="tu-client-secret"
   NEXT_PUBLIC_GITHUB_ENABLED="true"
   ```

### Google OAuth (Opcional)
1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto
3. Habilita la Google+ API
4. Crea credenciales OAuth 2.0
5. Añade a `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="tu-client-id"
   GOOGLE_CLIENT_SECRET="tu-client-secret"
   NEXT_PUBLIC_GOOGLE_ENABLED="true"
   ```

### EdgeStore - Subida de Imágenes (Opcional)
1. Ve a: https://edgestore.dev
2. Crea una cuenta y un proyecto
3. Obtén tus claves API
4. Añade a `.env.local`:
   ```env
   EDGE_STORE_ACCESS_KEY="tu-access-key"
   EDGE_STORE_SECRET_KEY="tu-secret-key"
   ```

### Stripe - Pagos (Opcional)
1. Ve a: https://stripe.com
2. Crea una cuenta
3. Obtén tus claves de prueba (Test Mode)
4. Añade a `.env.local`:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

## 🛠️ Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start

# Regenerar Prisma Client
npx prisma generate

# Sincronizar esquema con la base de datos
npx prisma db push

# Ver la base de datos en el navegador
npx prisma studio
```

## 📁 Estructura del Proyecto

```
huecoPark/
├── app/                    # Rutas de Next.js 14
│   ├── api/               # API Routes
│   ├── favorites/         # Página de favoritos
│   ├── listings/          # Detalle de parkings
│   ├── properties/        # Mis parkings
│   ├── reservations/      # Reservas recibidas
│   └── trips/             # Mis reservas
├── components/            # Componentes React
│   ├── modals/           # Modales
│   ├── navbar/           # Barra de navegación
│   └── inputs/           # Inputs personalizados
├── lib/                   # Configuraciones
├── prisma/               # Esquema de base de datos
├── services/             # Server Actions
└── utils/                # Utilidades
```

## 🎨 Características de huecoPark

- ✅ 15 Categorías de estacionamiento
- ✅ Búsqueda avanzada con filtros
- ✅ Sistema de favoritos
- ✅ Reservas con calendario
- ✅ Gestión de parkings propios
- ✅ Diseño responsive (móvil y desktop)
- ✅ Scroll infinito en listados
- ✅ Tema verde personalizado

## 🆘 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de que MongoDB esté accesible
3. Revisa que el archivo `.env.local` tenga la configuración correcta
4. Ejecuta `npm install` de nuevo

## 📝 Notas Importantes

- El archivo `.env.local` NO debe subirse a Git (ya está en .gitignore)
- Las credenciales de OAuth son opcionales para desarrollo
- Stripe solo es necesario si quieres procesar pagos reales
- EdgeStore solo es necesario para subir imágenes de parkings

---

¡Disfruta de **huecoPark**! 🅿️🚗💚

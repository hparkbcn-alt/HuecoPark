# ============================================
# GUIA RAPIDA: CREAR BASE DE DATOS MONGODB
# ============================================

Write-Host "`n" -NoNewline
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   CREAR BASE DE DATOS MONGODB      " -ForegroundColor Green  
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Paso 1: REGISTRARSE EN MONGODB ATLAS" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre tu navegador y ve a:" -ForegroundColor White
Write-Host "   https://www.mongodb.com/cloud/atlas/register" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Registrate con:" -ForegroundColor White
Write-Host "   - Email y password, O" -ForegroundColor Gray
Write-Host "   - Cuenta de Google (mas rapido)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Completa el formulario:" -ForegroundColor White
Write-Host "   - Goal: Learn MongoDB" -ForegroundColor Gray
Write-Host "   - Experience: New to MongoDB" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona ENTER cuando hayas terminado el registro..." -ForegroundColor Magenta
$null = Read-Host

Write-Host "`nPaso 2: CREAR CLUSTER GRATUITO" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Selecciona el plan:" -ForegroundColor White
Write-Host "   - M0 FREE (Shared)" -ForegroundColor Green
Write-Host "   - Es completamente GRATIS" -ForegroundColor Green
Write-Host ""
Write-Host "2. Configuracion:" -ForegroundColor White
Write-Host "   - Provider: AWS" -ForegroundColor Gray
Write-Host "   - Region: Europe West (Frankfurt) o cualquiera" -ForegroundColor Gray
Write-Host "   - Cluster Name: huecopark" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Click en 'Create Deployment'" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER cuando el cluster este creado..." -ForegroundColor Magenta
$null = Read-Host

Write-Host "`nPaso 3: CREAR USUARIO DE BASE DE DATOS" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "MongoDB te mostrara un popup para crear usuario:" -ForegroundColor White
Write-Host ""
Write-Host "1. Username (ya viene uno, puedes dejarlo)" -ForegroundColor Gray
Write-Host "2. Click en 'Autogenerate Secure Password'" -ForegroundColor Cyan
Write-Host ""
Write-Host "   IMPORTANTE: COPIA Y GUARDA LA PASSWORD!" -ForegroundColor Red
Write-Host ""
Write-Host "Pega aqui tu USERNAME:" -ForegroundColor Magenta
$dbUsername = Read-Host
Write-Host ""
Write-Host "Pega aqui tu PASSWORD:" -ForegroundColor Magenta
$dbPassword = Read-Host
Write-Host ""
Write-Host "3. Click en 'Create Database User'" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER cuando hayas creado el usuario..." -ForegroundColor Magenta
$null = Read-Host

Write-Host "`nPaso 4: CONFIGURAR ACCESO DE RED" -ForegroundColor Yellow
Write-Host "----------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "En el mismo popup:" -ForegroundColor White
Write-Host ""
Write-Host "1. En 'IP Access List':" -ForegroundColor White
Write-Host "   - Selecciona: 'My Local Environment'" -ForegroundColor Gray
Write-Host "   - Click en 'Add My Current IP Address'" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. IMPORTANTE: Agregar acceso desde cualquier IP" -ForegroundColor Red
Write-Host "   - Click en 'Add Entry'" -ForegroundColor Cyan
Write-Host "   - IP Address: 0.0.0.0/0" -ForegroundColor Cyan
Write-Host "   - Description: Acceso desde cualquier lugar" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Click en 'Finish and Close'" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER cuando hayas configurado el acceso..." -ForegroundColor Magenta
$null = Read-Host

Write-Host "`nPaso 5: OBTENER CONNECTION STRING" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. En la pagina principal, busca tu cluster" -ForegroundColor White
Write-Host "2. Click en el boton 'Connect'" -ForegroundColor Cyan
Write-Host "3. Selecciona 'Drivers'" -ForegroundColor White
Write-Host "4. Driver: Node.js / Version: 5.5 or later" -ForegroundColor Gray
Write-Host ""
Write-Host "5. COPIA el Connection String (se ve asi):" -ForegroundColor White
Write-Host "   mongodb+srv://usuario:<password>@cluster.xxxxx.mongodb.net/" -ForegroundColor Gray
Write-Host ""
Write-Host "Pega aqui tu CONNECTION STRING completo:" -ForegroundColor Magenta
$connectionString = Read-Host
Write-Host ""

# Procesar la connection string
if ($connectionString -match "mongodb\+srv://") {
    # Reemplazar <password> con la password real
    $connectionString = $connectionString -replace "<password>", $dbPassword
    
    # Agregar nombre de base de datos si no existe
    if ($connectionString -notmatch "/huecopark") {
        $connectionString = $connectionString -replace "mongodb.net/", "mongodb.net/huecopark"
    }
    
    # Asegurar parametros de query
    if ($connectionString -notmatch "\?") {
        $connectionString += "?retryWrites=true&w=majority"
    }
    
    Write-Host "`nPERFECTO! Tu connection string procesada es:" -ForegroundColor Green
    Write-Host $connectionString -ForegroundColor Cyan
    Write-Host ""
    
    # Actualizar .env.local
    Write-Host "Actualizando archivo .env.local..." -ForegroundColor Yellow
    
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent -replace 'DATABASE_URL="mongodb\+srv://username:password@cluster\.mongodb\.net/huecopark\?retryWrites=true&w=majority"', "DATABASE_URL=`"$connectionString`""
    
    Set-Content ".env.local" -Value $envContent -NoNewline
    
    Write-Host "Archivo .env.local ACTUALIZADO!" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host "ERROR: El connection string no parece valido" -ForegroundColor Red
    Write-Host "Debe empezar con: mongodb+srv://" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, edita manualmente el archivo .env.local" -ForegroundColor Yellow
    Write-Host "y reemplaza la linea DATABASE_URL con tu connection string" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "   SIGUIENTES PASOS                  " -ForegroundColor Green  
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora ejecuta estos comandos:" -ForegroundColor White
Write-Host ""
Write-Host "1. Crear las tablas en MongoDB:" -ForegroundColor Yellow
Write-Host "   npx prisma db push" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Cargar 15 parkings de Barcelona:" -ForegroundColor Yellow  
Write-Host "   npm run seed" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Iniciar el proyecto:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuario demo creado:" -ForegroundColor Green
Write-Host "   Email: demo@huecopark.com" -ForegroundColor Cyan
Write-Host "   Password: demo123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona ENTER para finalizar..." -ForegroundColor Magenta
$null = Read-Host

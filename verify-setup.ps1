# Script de Verificación de Setup - huecoPark
Write-Host "`n==================================" -ForegroundColor Green
Write-Host "🅿️  huecoPark - Verificador de Setup" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Green

$errors = 0
$warnings = 0

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js NO está instalado" -ForegroundColor Red
    Write-Host "   Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    $errors++
}

# Verificar npm
Write-Host "`nVerificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm NO está instalado" -ForegroundColor Red
    $errors++
}

# Verificar archivo .env.local
Write-Host "`nVerificando archivo .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ Archivo .env.local encontrado" -ForegroundColor Green
    
    # Leer y verificar variables importantes
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match 'DATABASE_URL="mongodb') {
        Write-Host "✅ DATABASE_URL configurada" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL no configurada o inválida" -ForegroundColor Yellow
        Write-Host "   Necesitas una base de datos MongoDB" -ForegroundColor Yellow
        $warnings++
    }
    
    if ($envContent -match 'NEXTAUTH_SECRET=".+"') {
        Write-Host "✅ NEXTAUTH_SECRET configurada" -ForegroundColor Green
    } else {
        Write-Host "⚠️  NEXTAUTH_SECRET vacía (se generará automáticamente)" -ForegroundColor Yellow
    }
    
    # OAuth Providers (opcionales)
    if ($envContent -match 'GITHUB_CLIENT_ID=""') {
        Write-Host "ℹ️  GitHub OAuth no configurado (opcional)" -ForegroundColor Cyan
    } else {
        Write-Host "✅ GitHub OAuth configurado" -ForegroundColor Green
    }
    
    if ($envContent -match 'GOOGLE_CLIENT_ID=""') {
        Write-Host "ℹ️  Google OAuth no configurado (opcional)" -ForegroundColor Cyan
    } else {
        Write-Host "✅ Google OAuth configurado" -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ Archivo .env.local NO encontrado" -ForegroundColor Red
    Write-Host "   Debe existir en la raíz del proyecto" -ForegroundColor Yellow
    $errors++
}

# Verificar node_modules
Write-Host "`nVerificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Carpeta node_modules encontrada" -ForegroundColor Green
} else {
    Write-Host "⚠️  Carpeta node_modules NO encontrada" -ForegroundColor Yellow
    Write-Host "   Ejecuta: npm install" -ForegroundColor Yellow
    $warnings++
}

# Verificar Prisma
Write-Host "`nVerificando Prisma..." -ForegroundColor Yellow
if (Test-Path "prisma/schema.prisma") {
    Write-Host "✅ Schema de Prisma encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Schema de Prisma NO encontrado" -ForegroundColor Red
    $errors++
}

if (Test-Path "node_modules/.prisma") {
    Write-Host "✅ Prisma Client generado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma Client no generado" -ForegroundColor Yellow
    Write-Host "   Ejecuta: npx prisma generate" -ForegroundColor Yellow
    $warnings++
}

# Resumen
Write-Host "`n==================================" -ForegroundColor Green
Write-Host "Resumen del Setup" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Green

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "🎉 ¡Todo está perfecto! Puedes ejecutar:" -ForegroundColor Green
    Write-Host "   npm run dev" -ForegroundColor Cyan
} elseif ($errors -eq 0) {
    Write-Host "⚠️  Hay $warnings advertencias, pero puedes continuar" -ForegroundColor Yellow
    Write-Host "`nPasos recomendados:" -ForegroundColor Yellow
    Write-Host "1. npm install" -ForegroundColor Cyan
    Write-Host "2. Configura tu DATABASE_URL en .env.local" -ForegroundColor Cyan
    Write-Host "3. npx prisma generate" -ForegroundColor Cyan
    Write-Host "4. npx prisma db push" -ForegroundColor Cyan
    Write-Host "5. npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Hay $errors errores críticos que debes solucionar" -ForegroundColor Red
    Write-Host "`nPasos necesarios:" -ForegroundColor Yellow
    if ($errors -gt 0) {
        Write-Host "1. Instala Node.js desde: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "2. Reinicia PowerShell" -ForegroundColor Cyan
        Write-Host "3. Ejecuta este script de nuevo" -ForegroundColor Cyan
    }
}

Write-Host "`nPara mas informacion, lee SETUP.md`n" -ForegroundColor Cyan

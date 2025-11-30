#!/bin/bash

# Script para limpiar comentarios en inglés y estilos inline
# Uso: ./cleanup.sh

echo "Iniciando limpieza de código..."

# Encontrar todos los archivos TypeScript y TSX
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    echo "Procesando: $file"
    
    # Crear backup temporal
    cp "$file" "$file.bak"
    
    # Eliminar comentarios de una línea en inglés (// ...)
    # Mantener comentarios con caracteres especiales españoles
    sed -i '' '/^[[:space:]]*\/\/[[:space:]]*[A-Za-z]/d' "$file"
    
    # Eliminar comentarios inline en inglés
    sed -i '' 's/[[:space:]]*\/\/[[:space:]]*[A-Za-z].*$//' "$file"
    
    echo "✓ Limpiado: $file"
done

echo "Limpieza completada!"

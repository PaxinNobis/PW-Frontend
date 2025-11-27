# 🌱 Prompt para Generar Semillas de Base de Datos - AstroTV

Copia y pega este prompt a una IA para que genere las semillas de tu base de datos:

---

## 📋 PROMPT PARA LA IA

```
Necesito que me generes un archivo de semillas (seed) para mi base de datos de AstroTV, una plataforma de streaming similar a Twitch.

CONTEXTO DEL PROYECTO:
- Plataforma de streaming en vivo
- Sistema de monedas virtuales
- Niveles de streamer (12 niveles desde "Astronauta Novato" hasta "Deidad Eterna")
- Sistema de puntos y medallas
- Regalos personalizados
- Niveles de lealtad

TECNOLOGÍA:
- Backend: Node.js + Express + Prisma
- Base de datos: PostgreSQL
- ORM: Prisma

TABLAS PRINCIPALES:
1. users (usuarios y streamers)
2. streams (transmisiones en vivo)
3. games (juegos/categorías)
4. tags (etiquetas)
5. coin_packs (paquetes de monedas)
6. streamer_levels (12 niveles de streamer)
7. custom_gifts (regalos personalizados)
8. loyalty_levels (niveles de lealtad)
9. medals (medallas)
10. clips (clips destacados)
11. notifications (notificaciones)
12. friendships (amistades)
13. friend_requests (solicitudes de amistad)
14. active_viewers (espectadores en vivo)
15. chat_messages (mensajes de chat)
16. user_points (puntos de usuarios)
17. points_history (historial de puntos)
18. user_medals (medallas ganadas)
19. transactions (transacciones de pago)
20. user_social_links (redes sociales)

REQUISITOS PARA LAS SEMILLAS:

1. USUARIOS (15-20 usuarios):
   - 5 streamers activos con diferentes niveles
   - 10-15 viewers/usuarios normales
   - Emails únicos (formato: user1@example.com, streamer1@example.com)
   - Contraseñas hasheadas con bcrypt
   - Diferentes cantidades de monedas (0-5000)
   - Algunos online, otros offline
   - Bios variadas y realistas
   - Horas de streaming variadas para streamers

2. JUEGOS (10-15 juegos):
   - Juegos populares: Valorant, League of Legends, Minecraft, Fortnite, etc.
   - URLs de imágenes reales de los juegos
   - Asociar tags apropiados a cada juego

3. TAGS (20-25 tags):
   - Categorías: Acción, Aventura, RPG, FPS, MOBA, Estrategia, etc.
   - Idiomas: Español, Inglés
   - Otros: Competitivo, Casual, Educativo, Just Chatting

4. STREAMS (8-12 streams):
   - Algunos en vivo (isLive: true), otros offline
   - Títulos atractivos y variados
   - URLs de thumbnails realistas
   - Viewers entre 0-500
   - Asociar a streamers y juegos

5. COIN_PACKS (5 paquetes):
   - Pack Básico: 100 monedas - S/. 4.99
   - Pack Estándar: 500 monedas - S/. 19.99
   - Pack Premium: 1000 monedas - S/. 34.99
   - Pack Mega: 2500 monedas - S/. 79.99
   - Pack Ultra: 5000 monedas - S/. 149.99

6. STREAMER_LEVELS (12 niveles exactos):
   Nivel 1: Astronauta Novato (0-100 followers, 0-50 hours)
   Nivel 2: Explorador Planetario (101-500 followers, 51-150 hours)
   Nivel 3: Piloto Lunar (501-1500 followers, 151-300 hours)
   Nivel 4: Comandante Estelar (1501-5000 followers, 301-500 hours)
   Nivel 5: Coronel Galáctico (5001-15000 followers, 501-800 hours)
   Nivel 6: General Cósmico (15001-50000 followers, 801-1200 hours)
   Nivel 7: Señor Universal (50001-150000 followers, 1201-2000 hours)
   Nivel 8: Emperador Multiversal (150001-500000 followers, 2001-3000 hours)
   Nivel 9: Leyenda Omniversal (500001-1500000 followers, 3001-4500 hours)
   Nivel 10: Entidad Primigenia (1500001-5000000 followers, 4501-6500 hours)
   Nivel 11: Titán Dimensional (5000001-10000000 followers, 6501-9000 hours)
   Nivel 12: Deidad Eterna (10000001-25000000 followers, 9001-12000 hours)

7. CUSTOM_GIFTS (3-5 regalos por streamer):
   - Nombres creativos (ej: "Estrella Fugaz", "Cohete Espacial")
   - Costos variados (50-1000 monedas)
   - Puntos otorgados (10-500 puntos)

8. LOYALTY_LEVELS (3-4 niveles por streamer):
   - Bronce: 0-100 puntos
   - Plata: 101-500 puntos
   - Oro: 501-2000 puntos
   - Diamante: 2001+ puntos
   - Recompensas atractivas

9. MEDALS (5-8 medallas por streamer):
   - Niveles: Bronce, Plata, Oro, Platino, Diamante
   - Requisitos variados (mensajes, puntos)
   - Nombres creativos

10. CLIPS (2-4 clips por streamer):
    - Títulos emocionantes
    - URLs de videos
    - Thumbnails
    - Views variados (10-5000)

11. RELACIONES:
    - Friendships entre usuarios
    - Following entre usuarios y streamers
    - User_medals (algunos usuarios con medallas ganadas)
    - User_points (puntos acumulados por usuarios)
    - Active_viewers (algunos viewers en streams activos)
    - Chat_messages (10-20 mensajes en streams activos)

12. DATOS ADICIONALES:
    - Notifications (5-10 notificaciones por usuario)
    - Transactions (algunas transacciones completadas)
    - User_social_links (redes sociales para streamers)

FORMATO DE SALIDA:
- Archivo: seed.ts o seed.js para Prisma
- Usar async/await
- Usar prisma.model.create() o createMany()
- Incluir try/catch para manejo de errores
- Logs informativos de progreso
- Limpiar datos existentes antes de insertar (opcional)

EJEMPLO DE ESTRUCTURA:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');
  
  // Limpiar datos existentes (opcional)
  await prisma.chatMessage.deleteMany();
  await prisma.stream.deleteMany();
  // ... etc
  
  // Crear usuarios
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'streamer1@example.com',
        name: 'ProGamer',
        password: await bcrypt.hash('password123', 10),
        // ... más campos
      },
      // ... más usuarios
    ]
  });
  
  console.log('✅ Usuarios creados');
  
  // ... resto de datos
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

IMPORTANTE:
- Datos realistas y variados
- Relaciones correctas entre tablas
- IDs consistentes
- Fechas variadas pero lógicas
- Contraseñas hasheadas
- URLs válidas (pueden ser placeholders)
- Cantidad suficiente de datos para testing

Por favor, genera el archivo de seed completo con todos estos datos.
```

---

## 📝 Notas Adicionales

### Si usas Prisma:
1. Guarda el archivo como `prisma/seed.ts`
2. Agrega en `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```
3. Ejecuta: `npx prisma db seed`

### Si usas otro ORM:
Adapta el prompt según tu tecnología (Sequelize, TypeORM, etc.)

---

## 🎯 Resultado Esperado

La IA debería generar un archivo con:
- ✅ 15-20 usuarios variados
- ✅ 10-15 juegos con tags
- ✅ 8-12 streams activos/inactivos
- ✅ 12 niveles de streamer
- ✅ 5 paquetes de monedas
- ✅ Regalos, medallas, clips
- ✅ Relaciones entre entidades
- ✅ Datos de prueba realistas

---

**Última actualización:** 27 de noviembre, 2025

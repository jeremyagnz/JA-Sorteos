-- =============================================================================
-- EnduroCommunity - Seed Data
-- 1. Run schema.sql first
-- 2. Then run this file
-- 3. After inserting, manually set one user to admin:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- =============================================================================

-- Sample published events (organizer_id will need to be updated with a real user ID
-- or you can insert them after creating your first admin account)

-- To insert sample events after you have an admin user, run:
-- Replace 'YOUR-ADMIN-USER-ID' with the actual UUID from your profiles table

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user (or any user if no admin yet)
  SELECT id INTO admin_id FROM public.profiles LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE NOTICE 'No users found. Create an account first, then run this seed.';
    RETURN;
  END IF;

  -- Mark first user as admin
  UPDATE public.profiles SET role = 'admin' WHERE id = admin_id;

  -- Insert sample events
  INSERT INTO public.events (title, description, location, event_date, end_date, category, difficulty, max_participants, price, status, organizer_id)
  VALUES
  (
    'Campeonato Regional de Enduro Sierra Norte',
    'Una de las pruebas más exigentes del calendario regional. El recorrido atraviesa los mejores senderos de la Sierra Norte con un total de 180 km divididos en 3 jornadas.

El evento incluye:
- 3 etapas cronometradas
- Asistencia mecánica en base
- Cronometraje electrónico
- Trofeos para los 3 primeros de cada categoría

Se requiere licencia federativa en vigor y equipamiento homologado (casco ECE 22.06, botas, guantes, protecciones).',
    'Sierra Norte de Madrid, Madrid',
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '17 days',
    'Enduro',
    'advanced',
    80,
    45.00,
    'published',
    admin_id
  ),
  (
    'Trial Urbano Ciudad de Segovia',
    'Espectacular prueba de trial en pleno casco histórico de Segovia. Las secciones están diseñadas para disfrutar del deporte en un entorno único, con el Acueducto Romano como telón de fondo.

Abierto a todas las categorías incluyendo benjamines y cadetes. Gran ambiente familiar garantizado.

Incluye zona de espectadores, food trucks y zona kids.',
    'Plaza Mayor, Segovia',
    NOW() + INTERVAL '8 days',
    NOW() + INTERVAL '8 days',
    'Trial',
    'all',
    150,
    20.00,
    'published',
    admin_id
  ),
  (
    'Ruta Enduro Solidaria Montes de Toledo',
    'Ruta no competitiva por los Montes de Toledo. 120 km de pistas y senderos con distintos niveles de dificultad. La inscripción incluye desayuno, almuerzo de hermandad y cena en la dehesa.

Recaudación destinada a la Asociación de Enfermedades Raras de Castilla-La Mancha.

Plazas muy limitadas. Se admiten motos de enduro, trail y adventure.',
    'Mora, Toledo',
    NOW() + INTERVAL '22 days',
    NOW() + INTERVAL '22 days',
    'Enduro',
    'intermediate',
    60,
    35.00,
    'published',
    admin_id
  ),
  (
    'Motocross Open Circuito La Bañeza',
    'Jornada de puertas abiertas en el Circuito de La Bañeza. Competición libre por mangas con clasificación final. Categorías: 65cc, 85cc, 125cc, MX2, MX1, Open y Veteranos (+40).

El circuito cuenta con trampolín, whoops y la famosa curva de la herradura. Superficie arenosa con grip excelente.',
    'Circuito La Bañeza, León',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days',
    'Motocross',
    'intermediate',
    200,
    30.00,
    'published',
    admin_id
  ),
  (
    'Hard Enduro Desafío Gredos',
    'La prueba más dura del año. Ascensos técnicos, ríos, rocas y barros en el entorno natural del Parque Regional de Gredos. Solo para pilotos con experiencia en hard enduro.

Asistencia médica permanente. GPS track obligatorio. Moto de enduro exclusivamente (no trail).

Checkpoint obligatorio cada 30 km. Tiempo máximo 8 horas.',
    'Arenas de San Pedro, Ávila',
    NOW() + INTERVAL '45 days',
    NOW() + INTERVAL '45 days',
    'Hard Enduro',
    'advanced',
    50,
    60.00,
    'published',
    admin_id
  ),
  (
    'Supermoto Race Day Jerez',
    'Jornada de carreras de supermoto en el trazado corto del Circuito de Jerez. Cuatro mangas durante el día con clasificación final por categorías (Promoción, Junior, Senior, Elite).

Ambiente inmejorable, paddock amplio y cronometraje profesional. Alquiler de kits de supermoto disponible (consultar disponibilidad).',
    'Circuito de Jerez, Cádiz',
    NOW() + INTERVAL '12 days',
    NOW() + INTERVAL '12 days',
    'Supermoto',
    'intermediate',
    100,
    55.00,
    'published',
    admin_id
  ),
  (
    'Baja Cross Country Extremadura',
    'Prueba de cross country por las dehesas extremeñas. 250 km de recorrido señalizado con roadbook. Dos categorías: Moto y Quad. Asistencia permitida en 3 puntos fijos del recorrido.

Salida en formato rally desde Cáceres. Meta en Mérida con fiesta de clausura.',
    'Cáceres → Mérida, Extremadura',
    NOW() + INTERVAL '35 days',
    NOW() + INTERVAL '36 days',
    'Cross Country',
    'advanced',
    120,
    75.00,
    'published',
    admin_id
  ),
  (
    'Enduro Escuela para Principiantes',
    'Curso-evento perfecto para quienes quieren iniciarse en el enduro de forma segura y divertida. Monitores titulados te guiarán por pistas adaptadas a nivel principiante.

Se incluye:
- Charla teórica de seguridad
- Práctica de técnica básica (curvas, obstáculos, conducción en pendiente)
- Ruta guiada de 40 km
- Almuerzo

Motos de alquiler disponibles (consultar).',
    'Centro Deportivo El Pinar, Guadalajara',
    NOW() + INTERVAL '18 days',
    NOW() + INTERVAL '18 days',
    'Enduro',
    'beginner',
    25,
    0.00,
    'published',
    admin_id
  );

  RAISE NOTICE 'Seed data inserted successfully! Admin user: %', admin_id;
END $$;

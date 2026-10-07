# Estado actual
- T1-T4 de la historia 001 están implementadas: validación de nombre/notas, detección de duplicados y persistencia local.
- T5 está implementada, pendiente de verificación manual en Expo Go antes de marcarla como hecha.
- Jest: 2 suites y 12 pruebas pasan; `tsc --noEmit` y ESLint focalizado pasan.
- `npx expo lint` falla por no encontrar archivos en `app/`; el código modificado sí pasó ESLint focalizado.
- Se acordó aplicar el máximo académico de 20.00; la excepción 20.5 en la spec queda pendiente de corregirse en una fase separada.

# Próximos pasos
- Probar en Expo Go la pantalla de registro con la lista manual indicada y confirmar el resultado.
- Después de esa confirmación, marcar T5 y continuar T6-T8; no ejecutar la app desde esta implementación.

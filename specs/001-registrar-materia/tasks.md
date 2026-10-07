- [x] **T1. Definir la validación pura del nombre y la nota.** RF-02, RF-03, RF-04
  - Hecho cuando: las pruebas unitarias cubren nombre vacío, solo espacios, 50 caracteres válidos, 51 inválidos, nota 0 y 20 válidas, nota 21 inválida y decimales con punto/coma aceptados o rechazados según el formato.

- [x] **T2. Implementar la normalización del nombre para duplicados equivalentes.** RF-06, RNF-02
  - Hecho cuando: `normalizeSubjectName('Matemática ')` produce un valor equivalente a `normalizeSubjectName('matematica')` y la validación marca como duplicado un nombre que solo difiere en mayúsculas, espacios o tildes.

- [x] **T3. Consolidar la validación del registro completo con errores relevantes.** RF-01, RF-05, RF-06
  - Hecho cuando: `validateSubjectRegistration` devuelve un `errors` concreto para nombre y/o nota invalidada, conserva el valor del formulario en el estado de la pantalla y permite aceptar un caso válido sin errores.

- [x] **T4. Crear la capa de persistencia local para materias.** RF-07
  - Hecho cuando: `loadSubjects` devuelve `[]` si no existe clave guardada, `saveSubjects` serializa correctamente el arreglo y `createSubjectRecord` genera un objeto con `id`, `name`, `firstBimestreGrade` y `createdAt`.

- [ ] **T5. Construir la pantalla de registro con validación en tiempo de envío.** RF-01, RF-03, RF-04, RF-05, RNF-01
  - Hecho cuando: la pantalla muestra el título, los dos campos, el botón de guardar y mensajes específicos bajo cada input cuando el usuario envía un nombre o una nota inválidos.

- [ ] **T6. Guardar la materia y limpiar el formulario al éxito.** RF-01, RF-05
  - Hecho cuando: al pulsar “Guardar materia” con datos válidos, la materia se agrega a la lista y el formulario queda vacío con los errores ocultos, sin perder la experiencia del usuario.

- [ ] **T7. Cargar las materias persistidas al abrir la app.** RF-07
  - Hecho cuando: al iniciar la pantalla, la lista muestra las materias almacenadas previamente y la app no borra el historial al cerrarse y reabrirse.

- [ ] **T8. Verificar los casos límite de la historia y la lista manual de UI.** RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07
  - Hecho cuando: se comprueba en Jest la validación de los casos límite (nombre con 50/51 caracteres, nota 0/20/20.5/20,5, duplicado con tildes y mayúsculas) y en la pantalla se confirma que el formulario conserva los datos ingresados tras error y que la lista persiste al reiniciar la app.

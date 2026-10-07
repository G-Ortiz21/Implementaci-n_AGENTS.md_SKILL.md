# Plan 001 — Registrar una materia

## 1. Archivos y responsabilidades

- `src/domain/subject-registration.ts`: contiene la lógica pura del caso de uso. Centraliza la normalización del nombre, la validación del nombre, la validación de la nota del primer bimestre y la validación completa del registro para detectar duplicados equivalentes.
- `src/domain/__tests__/subject-registration.test.ts`: prueba las reglas de negocio antes de implementar la lógica de pantalla para asegurar que el flujo siga los requisitos y los casos límite.
- `src/storage/subjects-storage.ts`: gestiona la carga y el guardado de la lista en almacenamiento local. No contiene reglas de negocio; solo serializa y deserializa el arreglo de materias.
- `src/app/index.tsx`: pantalla principal de la app. Recoge la entrada del usuario, invoca la lógica de validación, muestra errores y repinta la lista de materias guardadas.

RF cubiertos por la parte de dominio: RF-02, RF-03, RF-04, RF-05, RF-06, RNF-02. RF cubiertos por la parte de almacenamiento: RF-07. RF cubiertos por la parte de interfaz: RF-01, RF-03, RF-04, RF-05, RF-06, RF-07, RNF-01.

## 2. Funciones puras de lógica

Las funciones puras deben vivir en dominio, sin React ni AsyncStorage:

- `normalizeSubjectName(value: string): string`: elimina tildes, normaliza espacios y compara en minúsculas para detectar duplicados equivalentes.
- `validateSubjectName(name: string): boolean`: acepta nombres con contenido útil (no vacío, no espacios puros, máximo 50 caracteres).
- `validateGradeInput(input: string): { isValid, value, error }`: valida el formato, el rango 0-20, el uso de punto o coma decimales y la cantidad máxima de decimales.
- `validateSubjectRegistration({ name, firstBimestreGrade, existingNames }): { isValid, errors, normalizedName?, gradeValue? }`: combina validación de nombre, nota y duplicados para devolver errores detallados y el valor normalizado listo para guardar.

Estas funciones son las que sostienen la prueba unitaria del caso de uso y evitan mezclar reglas de negocio con la UI.

## 3. Persistencia

La persistencia será local con AsyncStorage y una sola clave de almacenamiento de lista de materias:

- `calculadora-epn.subjects`: arreglo serializado de objetos `{ id, name, firstBimestreGrade, createdAt }`.
- `loadSubjects()`: lee el valor guardado, valida que sea un arreglo y filtra solo registros con la estructura mínima esperada; si falla la lectura, devuelve la lista vacía sin romper la pantalla.
- `saveSubjects(subjects)`: persiste la lista actual en JSON.
- `createSubjectRecord({ name, firstBimestreGrade })`: crea el objeto final con identificador único y timestamp.

Esto cumple RF-07 y evita que la información de materia se pierda al cerrar la app. La persistencia se limita al almacenamiento local contemplado por la historia; no introduce backend ni autenticación.

## 4. Algoritmo en pseudocódigo

```text
on submit:
  errors = {}

  if name is empty OR only spaces OR length > 50:
    errors.name = 'Ingresa un nombre válido para la materia.'
  else if normalizeSubjectName(name) is present in existingNames:
    errors.name = 'Ya tienes una materia con ese nombre.'

  gradeValidation = validateGradeInput(firstBimestreGrade)
  if gradeValidation.isValid is false:
    errors.firstBimestreGrade = gradeValidation.error

  if errors is not empty:
    keep current input values
    show error messages
    stop

  nextSubject = createSubjectRecord(name = trim(name), firstBimestreGrade = gradeValue)
  nextSubjects = [...subjects, nextSubject]
  saveSubjects(nextSubjects)
  clear form
  clear errors
  show new subject in list
```

El flujo permite conservar los valores ya escritos si falla la validación, de acuerdo con RF-05 y la Decisión 6.

## 5. Cómo se pinta en la interfaz

La pantalla principal se compone de:

- un título “Registrar materia”;
- dos campos de entrada: nombre y nota del primer bimestre;
- mensajes de error debajo de cada campo al fallar validación;
- un botón primario “Guardar materia”;
- una lista de materias registradas con nombre + nota del primer bimestre;
- una acción de eliminación con confirmación antes de borrar.

La experiencia debe respetar la paleta definida por la app y usar `TextInput` con estados de error visuales, sin ocultar el contenido ya escrito al fallar la validación. La lista debe renderizar el contenido persistido al abrir la app para cumplir RF-07.

## 6. Decisiones técnicas justificadas

- Decisión 1 y 3-4: rango de 0 a 20 y soporte de decimales con coma/punto. Se implementa con validación estricta del formato y rango, en vez de permitir cualquier número suelto, porque la historia exige exactitud académica y compatibilidad con entradas reales del usuario. Alternativa descartada: aceptar solo enteros o convertir cualquier valor a número sin normalización.
- Decisión 2: comparación de nombre ignorando mayúsculas y tildes. Se hace con `normalizeSubjectName`, que elimina acentos, recorta espacios y compara en minúsculas. Alternativa descartada: comparar cadenas sin normalizar, porque eso permitiría duplicados por diferencias de formato.
- Decisión 5: validación de nombre con longitud máxima de 50 caracteres y rechazo de solo espacios. Se justifica por la calidad del dato y la consistencia del registro. Alternativa descartada: aceptar nombres vacíos o extremadamente largos, que complicarían la gestión y la lectura de la lista.
- Decisión 6: conservar los datos del formulario tras un error. Se implementa con estados de valor y errores en la pantalla. Alternativa descartada: limpiar al invalidar, porque la historia exige que el usuario pueda corregir sin reescribir todo.
- Persistencia local en AsyncStorage: se usa almacenamiento local en lugar de memoria en proceso, porque la historia exige que los datos sobrevivan al cierre y reapertura de la app. Alternativa descartada: guardar solo en estado React, ya que se pierde al recargar la app.

## 7. Estrategia de pruebas con Jest

La lógica se prueba en `src/domain/__tests__/subject-registration.test.ts` con pruebas unitarias que cubren:

- normalización y comparación de nombres equivalentes con acentos y mayúsculas;
- rechazo de nombre vacío, espacios puros y longitud 51;
- aceptación de nota 0, 20, 15.5 y 20,5;
- rechazo de nota fuera de rango (-1, 21), con más de dos decimales y con separadores inválidos;
- validación del registro completo cuando el nombre ya existe en la lista;
- caso exitoso con nombre válido y nota válida.

La estrategia evita pruebas en rojo: antes de cada implementación de lógica se valida la regresión con los tests del dominio; la interfaz se valida después con la lista manual de verificación de la tarea correspondiente.

## 8. Cobertura de requisitos por parte del plan

- RF-01: validación del envío exitoso + formulario principal + persistencia de la materia.
- RF-02: validación numérica en la función `validateGradeInput`.
- RF-03: validación del nombre vacío, espacios y >50 caracteres.
- RF-04: validación de la nota vacía y fuera de rango.
- RF-05: conservar valores escritos y mostrar errores específicos.
- RF-06: detectar duplicados al normalizar el nombre.
- RF-07: lectura/escritura del arreglo persistido en AsyncStorage.
- RNF-01: mensajes explicativos y claridad de errores en la UI.
- RNF-02: comparación de nombres sin distinguir mayúsculas, minúsculas o tildes.

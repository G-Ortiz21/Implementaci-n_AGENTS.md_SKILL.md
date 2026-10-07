# Spec 001 — Registrar una materia

Estado:aprobado
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo
La aplicación debe permitir al estudiante registrar una materia asociada a la nota del primer bimestre, manteniendo una lista clara y consistente de materias. El objetivo es que el usuario pueda guardar una asignatura de forma segura, evitar registros duplicados y conservar la información incluso cuando exista un error en el formulario o el usuario cierre y vuelva a abrir la app.

## Usuarios
- Estudiante que registra materias del ciclo académico y necesita mantener un registro confiable de sus notas del primer bimestre.

## Historias de usuario
- Guardar una materia: el estudiante ingresa el nombre de la materia y la nota del primer bimestre para registrarla.
- Datos incompletos o inválidos: el estudiante intenta guardar una materia con un nombre o una nota no válidos y la app debe indicar exactamente qué corregir.
- Materia repetida: el estudiante intenta registrar una materia que ya existe con el mismo nombre, aunque difiera en mayúsculas o tildes.
- Conservar mis datos: el estudiante cierra y vuelve a abrir la app y la materia registrada continúa disponible.

## Definiciones
- Materia: una asignatura registrada por el estudiante para llevar su nota del primer bimestre.
- Nombre normalizado: nombre de la materia comparado sin distinguir entre mayúsculas y minúsculas ni acentos.

## Requisitos funcionales
- RF-01: CUANDO el estudiante ingresa un nombre de materia y una nota del primer bimestre válidos, EL SISTEMA debe guardar la materia y mostrarla en la lista de materias registradas. Origen: Escenario: Guardar una materia.
- RF-02: CUANDO el estudiante ingresa la nota del primer bimestre, EL SISTEMA debe aceptar valores numéricos comprendidos entre 0 y 20, incluyendo decimales con punto o coma como separador decimal. Origen: Decisión 1; Decisión 3; Decisión 4.
- RF-03: SI el estudiante deja vacío el nombre de la materia, escribe solo espacios o supera los 50 caracteres, ENTONCES EL SISTEMA debe mostrar un error y no guardar la materia. Origen: Escenario: Datos incompletos o inválidos; Decisión 5.
- RF-04: SI el estudiante deja vacía la nota del primer bimestre o ingresa un valor fuera del rango permitido, ENTONCES EL SISTEMA debe mostrar un error y no guardar la materia. Origen: Escenario: Datos incompletos o inválidos; Decisión 1.
- RF-05: SI el estudiante envía un nombre o una nota inválidos, ENTONCES EL SISTEMA debe conservar lo escrito en el formulario y mostrar el mensaje de error correspondiente, para que el usuario pueda corregirlo sin perder la información ingresada. Origen: Escenario: Datos incompletos o inválidos; Decisión 6.
- RF-06: SI el estudiante intenta registrar una materia cuyo nombre coincide con otra ya guardada ignorando mayúsculas y tildes, ENTONCES EL SISTEMA debe indicar que la materia ya existe y no debe duplicarla. Origen: Escenario: Materia repetida; Decisión 2.
- RF-07: CUANDO la materia se guarda correctamente, EL SISTEMA debe mantenerla disponible al volver a abrir la aplicación, con la nota del primer bimestre registrada. Origen: Escenario: Conservar mis datos.

## Requisitos no funcionales
- RNF-01: EL SISTEMA debe comunicar de forma clara qué campo o dato debe corregirse cuando la materia no puede guardarse. Origen: Escenario: Datos incompletos o inválidos.
- RNF-02: EL SISTEMA debe evitar la creación de registros duplicados equivalentes, aunque el usuario varíe el formato del nombre con mayúsculas, minúsculas o tildes. Origen: Decisión 2.

## Casos límite
- Nombre de materia con 50 caracteres exactos: debe aceptarse como válido.
- Nombre de materia con 51 caracteres: debe rechazarse como inválido.
- Nombre de materia vacío o compuesto únicamente por espacios: debe rechazarse como inválido.
- Nota con valor 0: debe aceptarse como válida.
- Nota con valor 20: debe aceptarse como válida.
- Nota con valor 20.5 o 20,5: debe aceptarse como válida si el formato decimal es correcto.
- Nota fuera del rango, por ejemplo -1 o 21: debe rechazarse como inválida.
- Nombre ya registrado con mayúsculas, minúsculas o tildes distintas: debe rechazarse como duplicado.

## Fuera de alcance
- Registrar notas del segundo bimestre o cualquier cálculo académico adicional.
- Crear usuarios, autenticación o almacenamiento en backend.
- Soportar más de una nota por materia o múltiples estados académicos simultáneos.

## Criterios de finalización
- El estudiante puede registrar una materia con una nota válida del primer bimestre.
- El sistema valida nombre y nota, informa errores y conserva los datos ingresados al fallar.
- El sistema impide duplicados de materia al comparar nombres sin distinguir mayúsculas ni tildes.
- La materia registrada permanece disponible al volver a abrir la aplicación.

## Dudas abiertas
- No hay dudas abiertas para esta historia.

## Revisión final de la spec
- Puntuación: 9/10.
- No hay escenarios de la HU sin RF cubiertos.
- No hay contradicciones entre los RF definidos ni conflicto con la constitución del proyecto.
- La especificación mantiene el alcance de la historia y no introduce decisiones de diseño o solución no solicitadas.

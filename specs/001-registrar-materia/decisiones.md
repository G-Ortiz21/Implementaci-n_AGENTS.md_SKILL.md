# Decisiones de la historia HU-001

1. Pregunta: ¿Cuál es el rango válido para la nota del primer bimestre que debe aceptar la app?
   Mi respuesta: 0 a 20.
   Motivo: La nota debe aceptar el rango normal del sistema académico para evitar rechazar calificaciones válidas y para mantener la lógica coherente con la regla de cálculo del supletorio.

2. Pregunta: Cuando el usuario intenta guardar otra materia, ¿se considera duplicada solo si el nombre coincide exactamente, o también si difiere en mayúsculas/minúsculas o tildes?
   Mi respuesta: Se considera duplicada si el nombre coincide ignorando mayúsculas y tildes.
   Motivo: Esto evita duplicados por variaciones de formato del mismo nombre, reduciendo frustración y evitando que el usuario cree dos registros de la misma materia.

3. Pregunta: ¿La nota del primer bimestre puede incluir decimales, o solo enteros?
   Mi respuesta: La nota puede incluir decimales.
   Motivo: Muchas calificaciones reales no son enteras y el usuario debe poder registrar el valor exacto que tiene, sin perder precisión en la nota guardada.

4. Pregunta: Cuando el usuario escribe la nota con decimales, ¿acepta coma o punto como separador decimal?
   Mi respuesta: La app acepta ambos formatos.
   Motivo: Aumenta la tolerancia a la entrada del usuario y reduce errores por diferencias de teclado o formato regional, sin cambiar la experiencia principal del flujo.

5. Pregunta: ¿Qué se considera un nombre inválido para la materia?
   Mi respuesta: Un nombre es inválido si está vacío, si solo contiene espacios o si supera los 50 caracteres.
   Motivo: Se protege la calidad del dato y se evitan nombres poco útiles o demasiado largos, mientras se mantiene una experiencia clara para el usuario.

6. Pregunta: Si el usuario envía un nombre o nota inválidos, ¿la app debe conservar lo que ya escribió para que lo corrija, o limpiar el formulario?
   Mi respuesta: La app debe conservar lo escrito y mostrar el error.
   Motivo: El usuario no pierde el trabajo realizado y puede corregir el error sin reescribir toda la información, lo que mejora la usabilidad y reduce frustración.

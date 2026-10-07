export type SubjectRegistrationErrors = Partial<Record<'name' | 'firstBimestreGrade', string>>;

export function normalizeSubjectName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function validateSubjectName(name: string): boolean {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 50 || trimmedName.replace(/\s/g, '').length === 0) {
    return false;
  }

  return true;
}

export function validateGradeInput(input: string): {
  isValid: boolean;
  value: number | null;
  error?: string;
} {
  const rawValue = input.trim();

  if (!rawValue) {
    return { isValid: false, value: null, error: 'La nota es obligatoria.' };
  }

  if (!/^(?:\d+(?:[.,]\d{1,2})?|[.,]\d{1,2})$/.test(rawValue)) {
    if (/^(?:\d+[.,]\d{3,}|[.,]\d{3,})$/.test(rawValue)) {
      return { isValid: false, value: null, error: 'La nota puede tener máximo dos decimales.' };
    }

    return { isValid: false, value: null, error: 'La nota debe estar entre 0 y 20.' };
  }

  const normalizedInput = rawValue.replace(',', '.');
  const numericValue = Number(normalizedInput.startsWith('.') ? `0${normalizedInput}` : normalizedInput);

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 20) {
    return { isValid: false, value: null, error: 'La nota debe estar entre 0 y 20.' };
  }

  return { isValid: true, value: numericValue };
}

export function validateSubjectRegistration({
  name,
  firstBimestreGrade,
  existingNames,
}: {
  name: string;
  firstBimestreGrade: string;
  existingNames: string[];
}): {
  isValid: boolean;
  errors: SubjectRegistrationErrors;
  normalizedName?: string;
  gradeValue?: number;
} {
  const errors: SubjectRegistrationErrors = {};

  if (!validateSubjectName(name)) {
    errors.name = 'Ingresa un nombre válido para la materia.';
  } else {
    const normalizedName = normalizeSubjectName(name);
    const subjectExists = existingNames.some((existingName) => normalizeSubjectName(existingName) === normalizedName);

    if (subjectExists) {
      errors.name = 'Ya tienes una materia con ese nombre.';
    }
  }

  const gradeValidation = validateGradeInput(firstBimestreGrade);

  if (!gradeValidation.isValid) {
    errors.firstBimestreGrade = gradeValidation.error ?? 'La nota es obligatoria.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalizedName: validateSubjectName(name) ? normalizeSubjectName(name) : undefined,
    gradeValue: gradeValidation.isValid ? gradeValidation.value ?? undefined : undefined,
  };
}

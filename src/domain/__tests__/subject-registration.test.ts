import {
  normalizeSubjectName,
  validateSubjectName,
  validateGradeInput,
  validateSubjectRegistration,
} from '@/domain/subject-registration';

describe('subject registration domain logic', () => {
  it('normalizes the subject name ignoring case and accents', () => {
    expect(normalizeSubjectName('  Matemática  ')).toBe('matematica');
    expect(normalizeSubjectName('Matemática ')).toBe(normalizeSubjectName('matematica'));
  });

  it('accepts a valid name and rejects empty or too-long names', () => {
    expect(validateSubjectName('Historia')).toBe(true);
    expect(validateSubjectName('a'.repeat(50))).toBe(true);
    expect(validateSubjectName('')).toBe(false);
    expect(validateSubjectName('   ')).toBe(false);
    expect(validateSubjectName('a'.repeat(51))).toBe(false);
  });

  it('accepts decimal grades written with comma or dot', () => {
    expect(validateGradeInput('0')).toEqual({ isValid: true, value: 0 });
    expect(validateGradeInput('15,5')).toEqual({ isValid: true, value: 15.5 });
    expect(validateGradeInput('15.5')).toEqual({ isValid: true, value: 15.5 });
    expect(validateGradeInput('19,5')).toEqual({ isValid: true, value: 19.5 });
    expect(validateGradeInput('19.5')).toEqual({ isValid: true, value: 19.5 });
    expect(validateGradeInput('20')).toEqual({ isValid: true, value: 20 });
  });

  it('rejects invalid grade values and more than two decimals', () => {
    expect(validateGradeInput('')).toEqual({ isValid: false, value: null, error: 'La nota es obligatoria.' });
    expect(validateGradeInput('21')).toEqual({ isValid: false, value: null, error: 'La nota debe estar entre 0 y 20.' });
    expect(validateGradeInput('20,5')).toEqual({ isValid: false, value: null, error: 'La nota debe estar entre 0 y 20.' });
    expect(validateGradeInput('-1')).toEqual({ isValid: false, value: null, error: 'La nota debe estar entre 0 y 20.' });
    expect(validateGradeInput('15,123')).toEqual({ isValid: false, value: null, error: 'La nota puede tener máximo dos decimales.' });
    expect(validateGradeInput('15.123')).toEqual({ isValid: false, value: null, error: 'La nota puede tener máximo dos decimales.' });
    expect(validateGradeInput('1,2.3').isValid).toBe(false);
  });

  it('validates the registration and flags duplicates ignoring case and accents', () => {
    const result = validateSubjectRegistration({
      name: 'Matemática',
      firstBimestreGrade: '15,5',
      existingNames: ['matematica', 'Física'],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toMatchObject({
      name: 'Ya tienes una materia con ese nombre.',
    });
  });

  it('rejects a duplicate with different casing, spacing, and accents', () => {
    const result = validateSubjectRegistration({
      name: '  MATEMÁTICA   ',
      firstBimestreGrade: '15,5',
      existingNames: ['matematica'],
    });

    expect(result.errors.name).toBe('Ya tienes una materia con ese nombre.');
  });

  it('allows saving a subject with a valid name and normal grade', () => {
    const result = validateSubjectRegistration({
      name: 'Química',
      firstBimestreGrade: '18,75',
      existingNames: ['matematica', 'Física'],
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.normalizedName).toBe('quimica');
    expect(result.gradeValue).toBe(18.75);
  });

  it('returns a specific error for each invalid registration field', () => {
    const result = validateSubjectRegistration({
      name: '   ',
      firstBimestreGrade: '',
      existingNames: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      name: 'Ingresa un nombre válido para la materia.',
      firstBimestreGrade: 'La nota es obligatoria.',
    });
  });
});

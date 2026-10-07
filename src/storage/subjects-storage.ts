import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubjectRecord = {
  id: string;
  name: string;
  firstBimestreGrade: number;
  createdAt: string;
};

const STORAGE_KEY = 'calculadora-epn.subjects';

export async function loadSubjects(): Promise<SubjectRecord[]> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

  if (rawValue === null) {
    return [];
  }

  const parsedValue: unknown = JSON.parse(rawValue);

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter((subject): subject is SubjectRecord => {
    if (!subject || typeof subject !== 'object') {
      return false;
    }

    return (
      'id' in subject &&
      typeof subject.id === 'string' &&
      'name' in subject &&
      typeof subject.name === 'string' &&
      'firstBimestreGrade' in subject &&
      typeof subject.firstBimestreGrade === 'number' &&
      'createdAt' in subject &&
      typeof subject.createdAt === 'string'
    );
  });
}

export async function saveSubjects(subjects: SubjectRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export function createSubjectRecord({ name, firstBimestreGrade }: { name: string; firstBimestreGrade: number }): SubjectRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    firstBimestreGrade,
    createdAt: new Date().toISOString(),
  };
}

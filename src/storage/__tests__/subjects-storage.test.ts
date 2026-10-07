import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSubjectRecord, loadSubjects, saveSubjects } from '@/storage/subjects-storage';

jest.mock('@react-native-async-storage/async-storage', () => {
  let values: Record<string, string> = {};

  return {
    __esModule: true,
    default: {
      clear: jest.fn(async () => {
        values = {};
      }),
      getItem: jest.fn(async (key: string) => values[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        values[key] = value;
      }),
    },
  };
});

describe('subjects storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('returns an empty list when no subjects have been stored', async () => {
    await expect(loadSubjects()).resolves.toEqual([]);
  });

  it('serializes and loads the saved subjects', async () => {
    const subjects = [
      {
        id: 'subject-1',
        name: 'Matemática',
        firstBimestreGrade: 18.5,
        createdAt: '2026-10-07T12:00:00.000Z',
      },
    ];

    await saveSubjects(subjects);

    await expect(loadSubjects()).resolves.toEqual(subjects);
  });

  it('creates a subject record with an id and timestamp', () => {
    const subject = createSubjectRecord({ name: 'Historia', firstBimestreGrade: 17 });

    expect(subject).toMatchObject({
      name: 'Historia',
      firstBimestreGrade: 17,
    });
    expect(subject.id).toEqual(expect.any(String));
    expect(new Date(subject.createdAt).toISOString()).toBe(subject.createdAt);
  });

  it('propagates storage read failures instead of treating them as an empty list', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage unavailable'));

    await expect(loadSubjects()).rejects.toThrow('Storage unavailable');
  });
});

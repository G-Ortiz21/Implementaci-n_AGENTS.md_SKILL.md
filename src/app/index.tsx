import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  validateSubjectRegistration,
} from '@/domain/subject-registration';
import {
  createSubjectRecord,
  loadSubjects,
  saveSubjects,
  type SubjectRecord,
} from '@/storage/subjects-storage';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [firstBimestreGrade, setFirstBimestreGrade] = useState('');
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [errors, setErrors] = useState<{ name?: string; firstBimestreGrade?: string }>({});

  useEffect(() => {
    async function loadSavedSubjects() {
      const savedSubjects = await loadSubjects();
      setSubjects(savedSubjects);
    }

    void loadSavedSubjects();
  }, []);

  const handleSubmit = async () => {
    const result = validateSubjectRegistration({
      name,
      firstBimestreGrade,
      existingNames: subjects.map((subject) => subject.name),
    });

    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    const nextSubject = createSubjectRecord({
      name: name.trim(),
      firstBimestreGrade: result.gradeValue ?? 0,
    });

    const nextSubjects = [...subjects, nextSubject];
    setSubjects(nextSubjects);
    await saveSubjects(nextSubjects);
    setName('');
    setFirstBimestreGrade('');
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirmación', '¿Deseas eliminar esta materia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const nextSubjects = subjects.filter((subject) => subject.id !== id);
          setSubjects(nextSubjects);
          await saveSubjects(nextSubjects);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Registrar materia</Text>

              <View style={styles.formCard}>
                <Text style={styles.label}>Nombre de la materia</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej. Matemática"
                  autoCapitalize="words"
                  autoCorrect={false}
                  accessibilityLabel="Nombre de la materia"
                  style={[styles.input, errors.name ? styles.inputError : null]}
                />
                {errors.name ? (
                  <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                    {errors.name}
                  </Text>
                ) : null}

                <Text style={styles.label}>Nota del primer bimestre</Text>
                <TextInput
                  value={firstBimestreGrade}
                  onChangeText={setFirstBimestreGrade}
                  placeholder="Ej. 18.75"
                  keyboardType="decimal-pad"
                  accessibilityLabel="Nota del primer bimestre"
                  style={[styles.input, errors.firstBimestreGrade ? styles.inputError : null]}
                />
                {errors.firstBimestreGrade ? (
                  <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                    {errors.firstBimestreGrade}
                  </Text>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Guardar materia"
                  style={styles.primaryButton}
                  onPress={() => {
                    void handleSubmit();
                  }}
                >
                  <Text style={styles.primaryButtonText}>Guardar materia</Text>
                </Pressable>
              </View>

              <Text style={styles.sectionTitle}>Materias registradas</Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aún no has registrado ninguna materia.</Text>
          }
          renderItem={({ item }) => (
            <Pressable onLongPress={() => handleDelete(item.id)} style={styles.subjectRow}>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectGrade}>1er bimestre: {item.firstBimestreGrade.toFixed(2)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.name}`}
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </Pressable>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e2e4e9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#001F3F',
    marginBottom: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#111111',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b5bbc8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111111',
    minHeight: 44,
  },
  inputError: {
    borderColor: '#d33724',
  },
  errorText: {
    color: '#d33724',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#357ca5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#001F3F',
    marginBottom: 12,
  },
  emptyText: {
    color: '#111111',
    fontSize: 14,
  },
  subjectRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: '#b5bbc8',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  subjectGrade: {
    fontSize: 13,
    color: '#5a6e82',
  },
  deleteButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#d33724',
    minHeight: 44,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  itemSeparator: {
    height: 12,
  },
});

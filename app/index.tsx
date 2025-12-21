import { router } from 'expo-router';
import { Divide, Minus, Plus, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Operation, useMath } from '@/contexts/MathContext';

const operations: { type: Operation; icon: typeof Plus; color: string; label: string }[] = [
  { type: '+', icon: Plus, color: '#4CAF50', label: 'Addition' },
  { type: '-', icon: Minus, color: '#FF9800', label: 'Subtraction' },
  { type: '×', icon: X, color: '#2196F3', label: 'Multiplication' },
  { type: '÷', icon: Divide, color: '#E91E63', label: 'Division' },
];

export default function OperationScreen() {
  const { setOperation, reset, decimalMode, setDecimalMode } = useMath();

  const handleOperationSelect = (operation: Operation) => {
    reset();
    setOperation(operation);
    router.push('/level');
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Math Learning App</Text>
          <Text style={styles.subtitle}>Choose an operation to practice</Text>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>
              {decimalMode ? 'Decimals enabled (0.1)' : 'Whole numbers only'}
            </Text>
            <Switch
              testID="decimal-toggle"
              value={decimalMode}
              onValueChange={setDecimalMode}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={decimalMode ? '#4CAF50' : '#9E9E9E'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {operations.map((op) => {
              const Icon = op.icon;
              return (
                <Pressable
                  key={op.type}
                  testID={`operation-${op.type}`}
                  style={({ pressed }) => [
                    styles.operationButton,
                    { backgroundColor: op.color },
                    pressed && styles.operationButtonPressed,
                  ]}
                  onPress={() => handleOperationSelect(op.type)}
                >
                  <View style={styles.iconContainer}>
                    <Icon size={50} color="#fff" strokeWidth={3} />
                  </View>
                  <Text style={styles.operationLabel}>{op.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E1F5E1',
    marginHorizontal: 0,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#81C784',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  grid: {
    gap: 16,
  },
  operationButton: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  operationButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  iconContainer: {
    marginBottom: 10,
  },
  operationLabel: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
  },
});

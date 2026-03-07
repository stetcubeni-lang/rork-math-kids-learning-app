import { router } from 'expo-router';
import { Divide, Minus, Plus, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Operation, useMath } from '@/contexts/MathContext';
import { useResponsive } from '@/hooks/useResponsive';

const operations: { type: Operation; icon: typeof Plus; color: string; label: string }[] = [
  { type: '+', icon: Plus, color: '#4CAF50', label: 'Addition' },
  { type: '-', icon: Minus, color: '#FF9800', label: 'Subtraction' },
  { type: '×', icon: X, color: '#2196F3', label: 'Multiplication' },
  { type: '÷', icon: Divide, color: '#E91E63', label: 'Division' },
];

export default function OperationScreen() {
  const { setOperation, reset, decimalMode, setDecimalMode } = useMath();
  const { fs, s, isTablet, contentMaxWidth, columns } = useResponsive();

  const handleOperationSelect = (operation: Operation) => {
    reset();
    setOperation(operation);
    router.push('/level');
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.innerContainer, { maxWidth: contentMaxWidth, alignSelf: 'center' as const, width: '100%' as const }]}>
          <View style={[styles.header, { paddingHorizontal: s(20), paddingTop: s(40) }]}>
            <Text style={[styles.title, { fontSize: fs(36) }]}>Math Learning App</Text>
            <Text style={[styles.subtitle, { fontSize: fs(18), marginBottom: s(24) }]}>Choose an operation to practice</Text>

            <View style={[styles.toggleContainer, { padding: s(16), borderRadius: s(16) }]}>
              <Text style={[styles.toggleLabel, { fontSize: fs(16) }]}>
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
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: s(20), paddingBottom: s(20) }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[
              styles.grid,
              { gap: s(16) },
              isTablet && { flexDirection: 'row' as const, flexWrap: 'wrap' as const },
            ]}>
              {operations.map((op) => {
                const Icon = op.icon;
                return (
                  <Pressable
                    key={op.type}
                    testID={`operation-${op.type}`}
                    style={({ pressed }) => [
                      styles.operationButton,
                      { backgroundColor: op.color, borderRadius: s(20), padding: s(20) },
                      isTablet && { width: `${Math.floor(100 / columns) - 2}%` as unknown as number },
                      pressed && styles.operationButtonPressed,
                    ]}
                    onPress={() => handleOperationSelect(op.type)}
                  >
                    <View style={{ marginBottom: s(10) }}>
                      <Icon size={fs(50)} color="#fff" strokeWidth={3} />
                    </View>
                    <Text style={[styles.operationLabel, { fontSize: fs(22) }]}>{op.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
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
  innerContainer: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
  },
  title: {
    fontWeight: '800' as const,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E1F5E1',
    borderWidth: 2,
    borderColor: '#81C784',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: {
    fontWeight: '600' as const,
    color: '#333',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
  grid: {
    gap: 16,
  },
  operationButton: {
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
  operationLabel: {
    fontWeight: '700' as const,
    color: '#fff',
  },
});

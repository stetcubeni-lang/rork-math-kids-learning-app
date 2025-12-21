import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Level, useMath } from '@/contexts/MathContext';

const levels: Level[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function LevelScreen() {
  const { operation, setLevel } = useMath();
  const [selectedLevel, setSelectedLevelState] = useState<Level | null>(null);

  if (!operation) {
    router.replace('/');
    return null;
  }

  const handleLevelSelect = (level: Level) => {
    setSelectedLevelState(level);
    setLevel(level);
    router.push('/practice');
  };

  const getOperationName = () => {
    switch (operation) {
      case '+':
        return 'Addition';
      case '-':
        return 'Subtraction';
      case '×':
        return 'Multiplication';
      case '÷':
        return 'Division';
    }
  };

  const getOperationColor = () => {
    switch (operation) {
      case '+':
        return '#4CAF50';
      case '-':
        return '#FF9800';
      case '×':
        return '#2196F3';
      case '÷':
        return '#E91E63';
    }
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            testID="back-button"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={28} color="#333" strokeWidth={2.5} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{getOperationName()}</Text>
            <Text style={styles.subtitle}>Choose your level</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {levels.map((level) => (
            <Pressable
              key={level}
              testID={`level-${level}`}
              style={({ pressed }) => [
                styles.levelButton,
                { borderColor: getOperationColor() },
                pressed && styles.levelButtonPressed,
                selectedLevel === level && {
                  backgroundColor: getOperationColor(),
                },
              ]}
              onPress={() => handleLevelSelect(level)}
            >
              <Text
                style={[
                  styles.levelText,
                  selectedLevel === level && styles.levelTextSelected,
                ]}
              >
                1 to {level}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  levelButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  levelText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#333',
  },
  levelTextSelected: {
    color: '#fff',
  },
});

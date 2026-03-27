import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Level, useMath } from '@/contexts/MathContext';
import { useResponsive } from '@/hooks/useResponsive';

const levels: Level[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function LevelScreen() {
  const { operation, setLevel } = useMath();
  const [selectedLevel, setSelectedLevelState] = useState<Level | null>(null);
  const { fs, s, isTablet, contentMaxWidth } = useResponsive();

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
        <View style={[styles.innerContainer, { maxWidth: contentMaxWidth, alignSelf: 'center' as const, width: '100%' as const }]}>
          <View style={[styles.header, { paddingHorizontal: s(20), paddingTop: s(20) }]}>
            <Pressable
              testID="back-button"
              style={[styles.backButton, { width: s(44), height: s(44), borderRadius: s(22) }]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={fs(28)} color="#333" strokeWidth={2.5} />
            </Pressable>
            <View style={[styles.titleContainer, { marginRight: s(44) }]}>
              <Text style={[styles.title, { fontSize: fs(28) }]}>{getOperationName()}</Text>
              <Text style={[styles.subtitle, { fontSize: fs(16) }]}>Choose your level</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: s(20), paddingBottom: s(20) }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[
              isTablet && { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: s(12) },
            ]}>
              {levels.map((level) => (
                <Pressable
                  key={level}
                  testID={`level-${level}`}
                  style={({ pressed }) => [
                    styles.levelButton,
                    {
                      borderColor: getOperationColor(),
                      borderRadius: s(16),
                      padding: s(20),
                      marginBottom: isTablet ? 0 : s(12),
                    },
                    isTablet && { width: '48%' as unknown as number },
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
                      { fontSize: fs(22) },
                      selectedLevel === level && styles.levelTextSelected,
                    ]}
                  >
                    1 to {level}
                  </Text>
                </Pressable>
              ))}
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
    backgroundColor: '#E3F2FD',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  title: {
    fontWeight: '800' as const,
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
  },
  levelButton: {
    backgroundColor: '#fff',
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
    fontWeight: '700' as const,
    color: '#333',
  },
  levelTextSelected: {
    color: '#fff',
  },
});

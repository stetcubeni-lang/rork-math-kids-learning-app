import { router } from 'expo-router';
import { ArrowLeft, Check, X as XIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Question, useMath } from '@/contexts/MathContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function PracticeScreen() {
  const {
    operation,
    level,
    questionSets,
    currentSetIndex,
    updateAnswer,
    goToNextSet,
    goToPreviousSet,
    generateQuestions,
    getScore,
    resetAnswers,
  } = useMath();

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { fs, s, contentMaxWidth } = useResponsive();

  useEffect(() => {
    if (!operation || !level) {
      router.replace('/');
      return;
    }
    if (questionSets.length === 0) {
      generateQuestions();
    }
  }, [operation, level, questionSets.length, generateQuestions]);

  if (!operation || !level) {
    return null;
  }

  const currentSet = questionSets[currentSetIndex];
  const hasNextSet = currentSetIndex < questionSets.length - 1;
  const hasPreviousSet = currentSetIndex > 0;
  const score = getScore();

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

  const handleAnswerSubmit = (question: Question) => {
    const answer = inputValues[question.id] || '';
    if (answer.trim() !== '') {
      updateAnswer(question.id, answer);
    }
  };

  const handleNext = () => {
    if (hasNextSet) {
      goToNextSet();
      setInputValues({});
    } else {
      generateQuestions();
      setInputValues({});
    }
  };

  const handlePrevious = () => {
    if (hasPreviousSet) {
      goToPreviousSet();
    }
  };

  const handleReset = () => {
    setInputValues({});
    resetAnswers();
  };

  const renderQuestion = (question: Question, _index: number) => {
    const isAnswered = question.isAnswered;
    const inputValue = inputValues[question.id] || question.userAnswer;

    return (
      <View
        key={question.id}
        style={[
          styles.questionCard,
          {
            borderRadius: s(20),
            padding: s(20),
          },
        ]}
      >
        <View style={styles.exerciseRow}>
          <Text style={[styles.questionText, { fontSize: fs(32) }]}>
            {question.num1} {question.operation} {question.num2} =
          </Text>

          <TextInput
            testID={`answer-input-${question.id}`}
            style={[
              styles.answerInput,
              {
                width: s(70),
                fontSize: fs(24),
                borderRadius: s(12),
                paddingHorizontal: s(8),
                paddingVertical: s(8),
              },
              isAnswered && styles.answerInputDisabled,
              isAnswered && question.isCorrect && styles.answerInputCorrect,
              isAnswered && !question.isCorrect && styles.answerInputIncorrect,
            ]}
            value={inputValue}
            onChangeText={(text) => {
              if (!isAnswered) {
                const normalizedText = text.replace(/,/g, '.');
                setInputValues((prev) => ({ ...prev, [question.id]: normalizedText }));
              }
            }}
            keyboardType="decimal-pad"
            editable={!isAnswered}
            placeholder="?"
            placeholderTextColor="#999"
            returnKeyType="done"
            onSubmitEditing={() => handleAnswerSubmit(question)}
          />

          {isAnswered && (
            <View style={styles.feedbackIcon}>
              {question.isCorrect ? (
                <Check size={fs(24)} color="#4CAF50" strokeWidth={3} />
              ) : (
                <XIcon size={fs(24)} color="#F44336" strokeWidth={3} />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.innerContainer, { maxWidth: contentMaxWidth, alignSelf: 'center' as const, width: '100%' as const }]}>
            <View style={[styles.header, { paddingHorizontal: s(20), paddingTop: s(20), paddingBottom: s(16) }]}>
              <Pressable
                testID="back-button"
                style={[styles.backButton, { width: s(44), height: s(44), borderRadius: s(22) }]}
                onPress={() => router.back()}
              >
                <ArrowLeft size={fs(24)} color="#333" strokeWidth={2.5} />
              </Pressable>

              <View style={styles.scoreContainer}>
                <View style={[styles.scoreRow, { gap: s(16) }]}>
                  <View style={[styles.scoreItem, { gap: s(4) }]}>
                    <Text style={[styles.scoreNumber, { fontSize: fs(18) }]}>{score.correct}</Text>
                    <Check size={fs(16)} color="#4CAF50" strokeWidth={3} />
                  </View>
                  <View style={[styles.scoreItem, { gap: s(4) }]}>
                    <Text style={[styles.scoreNumber, { fontSize: fs(18) }]}>{score.incorrect}</Text>
                    <XIcon size={fs(16)} color="#F44336" strokeWidth={3} />
                  </View>
                  <View style={styles.scoreItem}>
                    <Text style={[styles.scoreNumber, { fontSize: fs(18) }]}>{score.total}</Text>
                  </View>
                </View>
              </View>

              <Pressable
                testID="reset-button"
                style={[styles.resetButton, { backgroundColor: getOperationColor(), paddingHorizontal: s(16), paddingVertical: s(10), borderRadius: s(22) }]}
                onPress={handleReset}
              >
                <Text style={[styles.resetButtonText, { fontSize: fs(16) }]}>Reset</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingHorizontal: s(20), paddingBottom: s(20), gap: s(16) }]}
              showsVerticalScrollIndicator={false}
            >
              {currentSet?.questions.map((question, index) => renderQuestion(question, index))}
            </ScrollView>

            <View style={[styles.navigationContainer, { paddingHorizontal: s(20), paddingVertical: s(16), gap: s(12) }]}>
              <Pressable
                testID="previous-button"
                style={[
                  styles.navButton,
                  styles.previousButton,
                  { paddingVertical: s(16), borderRadius: s(16) },
                  !hasPreviousSet && styles.navButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={!hasPreviousSet}
              >
                <Text style={[styles.navButtonText, { fontSize: fs(18) }, !hasPreviousSet && styles.navButtonTextDisabled]}>
                  ← Previous
                </Text>
              </Pressable>

              <Pressable
                testID="next-button"
                style={[
                  styles.navButton,
                  styles.nextButton,
                  { backgroundColor: getOperationColor(), paddingVertical: s(16), borderRadius: s(16) },
                ]}
                onPress={handleNext}
              >
                <Text style={[styles.navButtonText, { fontSize: fs(18) }]}>Next →</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E8F5FF',
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreNumber: {
    fontWeight: '700' as const,
    color: '#333',
  },
  resetButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    fontWeight: '700' as const,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  questionCard: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#90CAF9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionText: {
    fontWeight: '700' as const,
    color: '#333',
  },
  answerInput: {
    fontWeight: '600' as const,
    color: '#333',
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },
  answerInputDisabled: {
    backgroundColor: '#FAFAFA',
  },
  answerInputCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  answerInputIncorrect: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  feedbackIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previousButton: {
    backgroundColor: '#9E9E9E',
  },
  navButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  nextButton: {
    flex: 1,
  },
  navButtonText: {
    fontWeight: '700' as const,
    color: '#fff',
  },
  navButtonTextDisabled: {
    color: '#BDBDBD',
  },
});

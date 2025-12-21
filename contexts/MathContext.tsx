import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';

export type Operation = '+' | '-' | '×' | '÷';
export type Level = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  userAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean;
}

export interface QuestionSet {
  id: string;
  questions: Question[];
}

interface MathState {
  operation: Operation | null;
  level: Level | null;
  decimalMode: boolean;
  questionSets: QuestionSet[];
  currentSetIndex: number;
  setOperation: (operation: Operation) => void;
  setLevel: (level: Level) => void;
  setDecimalMode: (enabled: boolean) => void;
  generateQuestions: () => void;
  updateAnswer: (questionId: string, answer: string) => void;
  goToNextSet: () => void;
  goToPreviousSet: () => void;
  reset: () => void;
  resetAnswers: () => void;
  getScore: () => { correct: number; incorrect: number; total: number };
}

function generateRandomQuestion(
  operation: Operation,
  level: Level,
  decimalMode: boolean
): Omit<Question, 'id' | 'userAnswer' | 'isAnswered' | 'isCorrect'> {
  let num1: number;
  let num2: number;
  let correctAnswer: number;

  switch (operation) {
    case '+':
      if (decimalMode) {
        num1 = Math.floor(Math.random() * level * 10) / 10;
        num2 = Math.floor(Math.random() * level * 10) / 10;
        correctAnswer = parseFloat((num1 + num2).toFixed(1));
      } else {
        num1 = Math.floor(Math.random() * level) + 1;
        num2 = Math.floor(Math.random() * level) + 1;
        correctAnswer = num1 + num2;
      }
      break;

    case '-':
      if (decimalMode) {
        num1 = Math.floor(Math.random() * level * 10) / 10;
        num2 = Math.floor(Math.random() * level * 10) / 10;
        if (num1 < num2) [num1, num2] = [num2, num1];
        correctAnswer = parseFloat((num1 - num2).toFixed(1));
      } else {
        num1 = Math.floor(Math.random() * level) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        correctAnswer = num1 - num2;
      }
      break;

    case '×':
      if (decimalMode) {
        const maxMultiplier = Math.floor(Math.sqrt(level));
        num1 = Math.floor(Math.random() * maxMultiplier * 10) / 10;
        num2 = Math.floor(Math.random() * maxMultiplier * 10) / 10;
        correctAnswer = parseFloat((num1 * num2).toFixed(1));
      } else {
        const maxMultiplier = Math.floor(Math.sqrt(level));
        num1 = Math.floor(Math.random() * maxMultiplier) + 1;
        num2 = Math.floor(Math.random() * maxMultiplier) + 1;
        correctAnswer = num1 * num2;
      }
      break;

    case '÷':
      const maxDivisor = Math.min(Math.floor(level / 2), 12);
      num2 = Math.floor(Math.random() * maxDivisor) + 1;
      
      if (decimalMode) {
        const dividend = Math.floor(Math.random() * level) + 1;
        num1 = dividend;
        correctAnswer = parseFloat((num1 / num2).toFixed(1));
      } else {
        const quotient = Math.floor(Math.random() * Math.floor(level / num2)) + 1;
        num1 = num2 * quotient;
        correctAnswer = num1 / num2;
      }
      break;
  }

  return { num1, num2, operation, correctAnswer };
}

export const [MathProvider, useMath] = createContextHook((): MathState => {
  const [operation, setOperationState] = useState<Operation | null>(null);
  const [level, setLevelState] = useState<Level | null>(null);
  const [decimalMode, setDecimalModeState] = useState<boolean>(false);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);

  const setOperation = useCallback((op: Operation) => {
    setOperationState(op);
  }, []);

  const setLevel = useCallback((lvl: Level) => {
    setLevelState(lvl);
  }, []);

  const setDecimalMode = useCallback((enabled: boolean) => {
    setDecimalModeState(enabled);
  }, []);

  const generateQuestions = useCallback(() => {
    if (!operation || !level) return;

    const questions: Question[] = Array.from({ length: 5 }, (_, i) => {
      const questionData = generateRandomQuestion(operation, level, decimalMode);
      return {
        ...questionData,
        id: `${Date.now()}-${i}`,
        userAnswer: '',
        isAnswered: false,
        isCorrect: false,
      };
    });

    const newSet: QuestionSet = {
      id: `set-${Date.now()}`,
      questions,
    };

    setQuestionSets((prev) => [...prev, newSet]);
    if (questionSets.length === 0) {
      setCurrentSetIndex(0);
    } else {
      setCurrentSetIndex((prev) => prev + 1);
    }
  }, [operation, level, decimalMode, questionSets.length]);

  const updateAnswer = useCallback((questionId: string, answer: string) => {
    setQuestionSets((prev) =>
      prev.map((set, idx) => {
        if (idx !== currentSetIndex) return set;

        return {
          ...set,
          questions: set.questions.map((q) => {
            if (q.id !== questionId) return q;

            const userAnswerNum = parseFloat(answer);
            const isCorrect =
              !isNaN(userAnswerNum) &&
              Math.abs(userAnswerNum - q.correctAnswer) < 0.01;

            return {
              ...q,
              userAnswer: answer,
              isAnswered: true,
              isCorrect,
            };
          }),
        };
      })
    );
  }, [currentSetIndex]);

  const goToNextSet = useCallback(() => {
    setCurrentSetIndex((prev) => prev + 1);
  }, []);

  const goToPreviousSet = useCallback(() => {
    setCurrentSetIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setQuestionSets([]);
    setCurrentSetIndex(0);
  }, []);

  const resetAnswers = useCallback(() => {
    setQuestionSets((prev) =>
      prev.map((set) => ({
        ...set,
        questions: set.questions.map((q) => ({
          ...q,
          userAnswer: '',
          isAnswered: false,
          isCorrect: false,
        })),
      }))
    );
  }, []);

  const getScore = useCallback(() => {
    let correct = 0;
    let incorrect = 0;
    let total = 0;

    questionSets.forEach((set, idx) => {
      if (idx <= currentSetIndex) {
        set.questions.forEach((q) => {
          if (q.isAnswered) {
            total++;
            if (q.isCorrect) {
              correct++;
            } else {
              incorrect++;
            }
          }
        });
      }
    });

    return { correct, incorrect, total };
  }, [questionSets, currentSetIndex]);

  return {
    operation,
    level,
    decimalMode,
    questionSets,
    currentSetIndex,
    setOperation,
    setLevel,
    setDecimalMode,
    generateQuestions,
    updateAnswer,
    goToNextSet,
    goToPreviousSet,
    reset,
    resetAnswers,
    getScore,
  };
});

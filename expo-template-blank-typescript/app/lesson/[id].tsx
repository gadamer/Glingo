import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Progress from 'react-native-progress';
import { useStore } from '../../store';

// Lesson data (in a real app, this would come from an API or database)
const lessonData = {
  '1': {
    title: 'Greetings',
    subtitle: 'Learn basic German greetings',
    image: 'https://images.pexels.com/photos/7516347/pexels-photo-7516347.jpeg',
    sections: [
      {
        type: 'introduction',
        title: 'Introduction to German Greetings',
        content: 'Greetings are an essential part of German culture. Germans value politeness and proper greetings in social interactions. In this lesson, you will learn the most common German greetings for different situations and times of day.'
      },
      {
        type: 'vocabulary',
        title: 'Basic Greetings',
        words: [
          { german: 'Hallo', english: 'Hello', audio: 'hallo.mp3' },
          { german: 'Guten Morgen', english: 'Good morning', audio: 'guten_morgen.mp3' },
          { german: 'Guten Tag', english: 'Good day', audio: 'guten_tag.mp3' },
          { german: 'Guten Abend', english: 'Good evening', audio: 'guten_abend.mp3' },
          { german: 'Auf Wiedersehen', english: 'Goodbye', audio: 'auf_wiedersehen.mp3' },
          { german: 'Tschüss', english: 'Bye (informal)', audio: 'tschuss.mp3' },
        ]
      },
      {
        type: 'practice',
        title: 'Practice: Match the Greetings',
        pairs: [
          { question: 'Hallo', answer: 'Hello' },
          { question: 'Guten Morgen', answer: 'Good morning' },
          { question: 'Guten Tag', answer: 'Good day' },
          { question: 'Guten Abend', answer: 'Good evening' },
          { question: 'Auf Wiedersehen', answer: 'Goodbye' },
        ]
      },
      {
        type: 'culture',
        title: 'Cultural Note',
        content: 'In Germany, it\'s common to greet people with a handshake in formal situations. Among friends, people might greet each other with a hug or kisses on the cheek, especially in southern Germany. The greeting "Servus" is commonly used in Bavaria and Austria as both a greeting and farewell.',
        image: 'https://images.pexels.com/photos/2406271/pexels-photo-2406271.jpeg'
      },
      {
        type: 'quiz',
        title: 'Quick Quiz',
        questions: [
          {
            question: 'How do you say "Good morning" in German?',
            options: ['Guten Tag', 'Guten Abend', 'Guten Morgen', 'Hallo'],
            correctAnswer: 'Guten Morgen'
          },
          {
            question: 'Which greeting would you use in the evening?',
            options: ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht'],
            correctAnswer: 'Guten Abend'
          },
          {
            question: 'What is an informal way to say goodbye?',
            options: ['Auf Wiedersehen', 'Tschüss', 'Guten Tag', 'Hallo'],
            correctAnswer: 'Tschüss'
          }
        ]
      }
    ]
  },
  '2': {
    title: 'Numbers 1-10',
    subtitle: 'Count from one to ten in German',
    image: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg',
    sections: [
      {
        type: 'introduction',
        title: 'Introduction to German Numbers',
        content: 'Learning to count in German is one of the first steps in mastering the language. In this lesson, you will learn the numbers from 1 to 10 in German, their pronunciation, and how to use them in basic sentences.'
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        words: [
          { german: 'eins', english: 'one', audio: 'eins.mp3' },
          { german: 'zwei', english: 'two', audio: 'zwei.mp3' },
          { german: 'drei', english: 'three', audio: 'drei.mp3' },
          { german: 'vier', english: 'four', audio: 'vier.mp3' },
          { german: 'fünf', english: 'five', audio: 'funf.mp3' },
          { german: 'sechs', english: 'six', audio: 'sechs.mp3' },
          { german: 'sieben', english: 'seven', audio: 'sieben.mp3' },
          { german: 'acht', english: 'eight', audio: 'acht.mp3' },
          { german: 'neun', english: 'nine', audio: 'neun.mp3' },
          { german: 'zehn', english: 'ten', audio: 'zehn.mp3' },
        ]
      }
    ]
  },
  '3': {
    title: 'Common Phrases',
    subtitle: 'Essential phrases for daily conversations',
    image: 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg',
    sections: [
      {
        type: 'introduction',
        title: 'Introduction to Common German Phrases',
        content: 'In this lesson, you will learn essential German phrases that will help you navigate everyday situations. These phrases are useful for basic communication, asking questions, and expressing common needs.'
      }
    ]
  }
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessonData[lessonId as keyof typeof lessonData];
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { addXp, completeLesson } = useStore();

  const currentSection = lesson.sections[currentSectionIndex];
  const progress = (currentSectionIndex + 1) / lesson.sections.length;

  const handleNext = () => {
    if (currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Lesson completed
      setLessonCompleted(true);
      completeLesson();
      addXp(50); // Award XP for completing the lesson
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: 'de-DE',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    if (!quizSubmitted) {
      setQuizAnswers({
        ...quizAnswers,
        [questionIndex]: answer
      });
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    
    // Calculate correct answers
    const quizSection = lesson.sections.find(section => section.type === 'quiz');
    if (quizSection && 'questions' in quizSection) {
      const correctCount = quizSection.questions.filter(
        (q, index) => quizAnswers[index] === q.correctAnswer
      ).length;
      
      // Award XP based on correct answers
      addXp(correctCount * 5);
    }
  };

  const isQuizComplete = () => {
    const quizSection = currentSection.type === 'quiz' ? currentSection : null;
    if (!quizSection || !('questions' in quizSection)) return false;
    
    return quizSection.questions.every((_, index) => quizAnswers[index] !== undefined);
  };

  const getQuizScore = () => {
    const quizSection = currentSection.type === 'quiz' ? currentSection : null;
    if (!quizSection || !('questions' in quizSection)) return 0;
    
    return quizSection.questions.filter(
      (q, index) => quizAnswers[index] === q.correctAnswer
    ).length;
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {lessonCompleted ? (
        <View style={styles.completionContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/7516339/pexels-photo-7516339.jpeg' }} 
            style={styles.completionImage} 
          />
          <View style={styles.completionContent}>
            <Text style={styles.completionTitle}>Lesson Completed!</Text>
            <Text style={styles.completionSubtitle}>Great job learning {lesson.title}</Text>
            
            <View style={styles.rewardCard}>
              <Feather name="zap" size={24} color="#F7C04F" />
              <Text style={styles.rewardText}>+50 XP Earned</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueButtonText}>Continue Learning</Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
            <View style={styles.overlay} />
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <Progress.Bar 
                progress={progress} 
                width={null} 
                height={8}
                color="#4F8EF7"
                unfilledColor="#E1E1E1"
                borderWidth={0}
                borderRadius={4}
              />
              <Text style={styles.progressText}>
                {currentSectionIndex + 1} of {lesson.sections.length}
              </Text>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{currentSection.title}</Text>
              
              {currentSection.type === 'introduction' && (
                <Text style={styles.introductionText}>{currentSection.content}</Text>
              )}
              
              {currentSection.type === 'vocabulary' && 'words' in currentSection && (
                <View style={styles.vocabularyContainer}>
                  {currentSection.words.map((word, index) => (
                    <View key={index} style={styles.wordCard}>
                      <View style={styles.wordContent}>
                        <Text style={styles.germanWord}>{word.german}</Text>
                        <Text style={styles.englishWord}>{word.english}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.audioButton}
                        onPress={() => speakWord(word.german)}
                      >
                        <Feather name="volume-2" size={20} color="#4F8EF7" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              {currentSection.type === 'practice' && 'pairs' in currentSection && (
                <View style={styles.practiceContainer}>
                  <Text style={styles.practiceInstructions}>
                    Match the German phrases with their English translations.
                  </Text>
                  {currentSection.pairs.map((pair, index) => (
                    <View key={index} style={styles.practicePair}>
                      <View style={styles.practiceQuestion}>
                        <Text style={styles.practiceGerman}>{pair.question}</Text>
                        <TouchableOpacity 
                          style={styles.miniAudioButton}
                          onPress={() => speakWord(pair.question)}
                        >
                          <Feather name="volume-2" size={16} color="#4F8EF7" />
                        </TouchableOpacity>
                      </View>
                      <Feather name="arrow-right" size={20} color="#ADB5BD" />
                      <Text style={styles.practiceEnglish}>{pair.answer}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {currentSection.type === 'culture' && (
                <View style={styles.cultureContainer}>
                  <Text style={styles.cultureText}>{currentSection.content}</Text>
                  {'image' in currentSection && (
                    <Image 
                      source={{ uri: currentSection.image }} 
                      style={styles.cultureImage} 
                    />
                  )}
                </View>
              )}
              
              {currentSection.type === 'quiz' && 'questions' in currentSection && (
                <View style={styles.quizContainer}>
                  {quizSubmitted ? (
                    <View style={styles.quizResults}>
                      <Text style={styles.quizResultsTitle}>
                        Your Score: {getQuizScore()}/{currentSection.questions.length}
                      </Text>
                      {currentSection.questions.map((question, qIndex) => (
                        <View key={qIndex} style={styles.quizResultQuestion}>
                          <Text style={styles.quizQuestionText}>{question.question}</Text>
                          {question.options.map((option, oIndex) => (
                            <View 
                              key={oIndex} 
                              style={[
                                styles.quizOption,
                                quizAnswers[qIndex] === option && styles.quizOptionSelected,
                                quizSubmitted && option === question.correctAnswer && styles.quizOptionCorrect,
                                quizSubmitted && quizAnswers[qIndex] === option && 
                                option !== question.correctAnswer && styles.quizOptionIncorrect,
                              ]}
                            >
                              <Text style={[
                                styles.quizOptionText,
                                quizAnswers[qIndex] === option && styles.quizOptionTextSelected,
                                quizSubmitted && option === question.correctAnswer && styles.quizOptionTextCorrect,
                                quizSubmitted && quizAnswers[qIndex] === option && 
                                option !== question.correctAnswer && styles.quizOptionTextIncorrect,
                              ]}>
                                {option}
                              </Text>
                              {quizSubmitted && option === question.correctAnswer && (
                                <Feather name="check" size={16} color="#4FF783" />
                              )}
                              {quizSubmitted && quizAnswers[qIndex] === option && 
                                option !== question.correctAnswer && (
                                <Feather name="x" size={16} color="#F74F4F" />
                              )}
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <>
                      {currentSection.questions.map((question, qIndex) => (
                        <View key={qIndex} style={styles.quizQuestion}>
                          <Text style={styles.quizQuestionText}>{question.question}</Text>
                          {question.options.map((option, oIndex) => (
                            <TouchableOpacity 
                              key={oIndex} 
                              style={[
                                styles.quizOption,
                                quizAnswers[qIndex] === option && styles.quizOptionSelected
                              ]}
                              onPress={() => handleQuizAnswer(qIndex, option)}
                            >
                              <Text style={[
                                styles.quizOptionText,
                                quizAnswers[qIndex] === option && styles.quizOptionTextSelected
                              ]}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                      <TouchableOpacity 
                        style={[
                          styles.quizSubmitButton,
                          !isQuizComplete() && styles.quizSubmitButtonDisabled
                        ]}
                        onPress={handleQuizSubmit}
                        disabled={!isQuizComplete()}
                      >
                        <Text style={styles.quizSubmitButtonText}>Submit Answers</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevious}
              disabled={currentSectionIndex === 0}
            >
              <Feather 
                name="arrow-left" 
                size={20} 
                color={currentSectionIndex === 0 ? "#ADB5BD" : "#4F8EF7"} 
              />
              <Text style={[
                styles.navButtonText, 
                currentSectionIndex === 0 && styles.navButtonTextDisabled
              ]}>
                Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
              disabled={currentSection.type === 'quiz' && !quizSubmitted && !isQuizComplete()}
            >
              <Text style={styles.navButtonText}>
                {currentSectionIndex === lesson.sections.length - 1 ? 'Complete' : 'Next'}
              </Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  lessonImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  lessonTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lessonSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    textAlign: 'right',
  },
  sectionContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for navigation buttons
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  introductionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
    lineHeight: 24,
  },
  vocabularyContainer: {
    marginBottom: 16,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordContent: {
    flex: 1,
  },
  germanWord: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  englishWord: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  practiceContainer: {
    marginBottom: 16,
  },
  practiceInstructions: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
    marginBottom: 16,
  },
  practicePair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  practiceQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  practiceGerman: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
    marginRight: 8,
  },
  miniAudioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  practiceEnglish: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
    flex: 1,
    textAlign: 'right',
  },
  cultureContainer: {
    marginBottom: 16,
  },
  cultureText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
    lineHeight: 24,
    marginBottom: 16,
  },
  cultureImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  quizContainer: {
    marginBottom: 16,
  },
  quizQuestion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quizQuestionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
    marginBottom: 16,
  },
  quizOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  quizOptionSelected: {
    borderColor: '#4F8EF7',
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
  },
  quizOptionCorrect: {
    borderColor: '#4FF783',
    backgroundColor: 'rgba(79, 247, 131, 0.1)',
  },
  quizOptionIncorrect: {
    borderColor: '#F74F4F',
    backgroundColor: 'rgba(247, 79, 79, 0.1)',
  },
  quizOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
  },
  quizOptionTextSelected: {
    color: '#4F8EF7',
    fontFamily: 'Poppins-Medium',
  },
  quizOptionTextCorrect: {
    color: '#4FF783',
    fontFamily: 'Poppins-Medium',
  },
  quizOptionTextIncorrect: {
    color: '#F74F4F',
    fontFamily: 'Poppins-Medium',
  },
  quizSubmitButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  quizSubmitButtonDisabled: {
    backgroundColor: '#ADB5BD',
  },
  quizSubmitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  quizResults: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quizResultsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  quizResultQuestion: {
    marginBottom: 16,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    padding: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  prevButton: {
    backgroundColor: '#F8F9FA',
  },
  nextButton: {
    backgroundColor: '#4F8EF7',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4F8EF7',
    marginLeft: 8,
  },
  navButtonTextDisabled: {
    color: '#ADB5BD',
  },
  completionContainer: {
    flex: 1,
  },
  completionImage: {
    width: '100%',
    height: '40%',
  },
  completionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    marginBottom: 32,
    textAlign: 'center',
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247, 192, 79, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 32,
  },
  rewardText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#F7C04F',
    marginLeft: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F8EF7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    marginRight: 8,
  },
});

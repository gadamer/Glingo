import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useStore } from '../../store';

const practiceCategories = [
  { id: '1', title: 'Pronunciation', icon: 'mic', color: '#4F8EF7' },
  { id: '2', title: 'Vocabulary', icon: 'book', color: '#F7C04F' },
  { id: '3', title: 'Listening', icon: 'headphones', color: '#F74F4F' },
  { id: '4', title: 'Reading', icon: 'book-open', color: '#4FF783' },
];

const pronunciationExercises = [
  {
    id: '1',
    german: 'Guten Morgen',
    english: 'Good morning',
    audio: 'guten_morgen.mp3',
    difficulty: 'Easy',
  },
  {
    id: '2',
    german: 'Wie geht es dir?',
    english: 'How are you?',
    audio: 'wie_geht_es_dir.mp3',
    difficulty: 'Easy',
  },
  {
    id: '3',
    german: 'Ich heiße...',
    english: 'My name is...',
    audio: 'ich_heisse.mp3',
    difficulty: 'Easy',
  },
  {
    id: '4',
    german: 'Entschuldigung',
    english: 'Excuse me / Sorry',
    audio: 'entschuldigung.mp3',
    difficulty: 'Medium',
  },
  {
    id: '5',
    german: 'Ich verstehe nicht',
    english: 'I don\'t understand',
    audio: 'ich_verstehe_nicht.mp3',
    difficulty: 'Medium',
  },
];

export default function PracticeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  
  const { addXp } = useStore();

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setSelectedExercise(null);
    setFeedback(null);
  };

  const handleExerciseSelect = (id: string) => {
    setSelectedExercise(id);
    setFeedback(null);
  };

  const speakPhrase = (phrase: string) => {
    Speech.speak(phrase, {
      language: 'de-DE',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  const startListening = () => {
    // In a real app, this would use Speech Recognition
    setIsListening(true);
    
    // Simulate speech recognition with a timeout
    setTimeout(() => {
      setIsListening(false);
      
      // Simulate random success/failure for demo purposes
      const isCorrect = Math.random() > 0.3;
      
      if (isCorrect) {
        setFeedback('Great pronunciation!');
        setFeedbackType('success');
        addXp(10);
      } else {
        setFeedback('Try again with clearer pronunciation');
        setFeedbackType('error');
      }
    }, 2000);
  };

  const getSelectedExercise = () => {
    return pronunciationExercises.find(ex => ex.id === selectedExercise);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice German</Text>
        <Text style={styles.headerSubtitle}>Improve your speaking skills</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {practiceCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: category.color },
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Feather name={category.icon as any} size={24} color="#fff" />
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedCategory === '1' && (
        <ScrollView style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Pronunciation Exercises</Text>
          <Text style={styles.sectionSubtitle}>
            Listen to the audio and practice your pronunciation
          </Text>

          {selectedExercise ? (
            <View style={styles.exerciseDetailCard}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedExercise(null)}
              >
                <Feather name="arrow-left" size={24} color="#4F8EF7" />
              </TouchableOpacity>
              
              <View style={styles.exerciseHeader}>
                <View>
                  <Text style={styles.exerciseDetailGerman}>
                    {getSelectedExercise()?.german}
                  </Text>
                  <Text style={styles.exerciseDetailEnglish}>
                    {getSelectedExercise()?.english}
                  </Text>
                </View>
                <View style={[
                  styles.difficultyBadge, 
                  { backgroundColor: getSelectedExercise()?.difficulty === 'Easy' ? '#4FF783' : '#F7C04F' }
                ]}>
                  <Text style={styles.difficultyText}>
                    {getSelectedExercise()?.difficulty}
                  </Text>
                </View>
              </View>
              
              <View style={styles.audioSection}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => speakPhrase(getSelectedExercise()?.german || '')}
                >
                  <Feather name="play" size={24} color="#fff" />
                  <Text style={styles.playButtonText}>Listen</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.recordButton,
                    isListening && styles.recordingButton
                  ]}
                  onPress={startListening}
                  disabled={isListening}
                >
                  <Feather name={isListening ? "mic-off" : "mic"} size={24} color="#fff" />
                  <Text style={styles.recordButtonText}>
                    {isListening ? 'Listening...' : 'Speak Now'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {feedback && (
                <View style={[
                  styles.feedbackContainer,
                  feedbackType === 'success' ? styles.successFeedback : styles.errorFeedback
                ]}>
                  <Feather 
                    name={feedbackType === 'success' ? "check-circle" : "alert-circle"} 
                    size={20} 
                    color={feedbackType === 'success' ? "#4FF783" : "#F74F4F"} 
                  />
                  <Text style={[
                    styles.feedbackText,
                    feedbackType === 'success' ? styles.successText : styles.errorText
                  ]}>
                    {feedback}
                  </Text>
                </View>
              )}
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Pronunciation Tips:</Text>
                <View style={styles.tipItem}>
                  <Feather name="info" size={16} color="#4F8EF7" />
                  <Text style={styles.tipText}>
                    Pay attention to the vowel sounds in German
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Feather name="info" size={16} color="#4F8EF7" />
                  <Text style={styles.tipText}>
                    The 'ch' sound is made by pushing air through a narrow passage
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            pronunciationExercises.map((exercise) => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exerciseCard}
                onPress={() => handleExerciseSelect(exercise.id)}
              >
                <View>
                  <Text style={styles.exerciseGerman}>{exercise.german}</Text>
                  <Text style={styles.exerciseEnglish}>{exercise.english}</Text>
                </View>
                <View style={styles.exerciseActions}>
                  <TouchableOpacity 
                    style={styles.audioButton}
                    onPress={() => speakPhrase(exercise.german)}
                  >
                    <Feather name="volume-2" size={20} color="#4F8EF7" />
                  </TouchableOpacity>
                  <View style={[
                    styles.difficultyBadge, 
                    { backgroundColor: exercise.difficulty === 'Easy' ? '#4FF783' : '#F7C04F' }
                  ]}>
                    <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {selectedCategory === '2' && (
        <View style={styles.comingSoonContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg' }} 
            style={styles.comingSoonImage} 
          />
          <Text style={styles.comingSoonTitle}>Vocabulary Practice</Text>
          <Text style={styles.comingSoonText}>
            Vocabulary practice exercises are coming soon! Check back later for updates.
          </Text>
        </View>
      )}

      {selectedCategory === '3' && (
        <View style={styles.comingSoonContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg' }} 
            style={styles.comingSoonImage} 
          />
          <Text style={styles.comingSoonTitle}>Listening Practice</Text>
          <Text style={styles.comingSoonText}>
            Listening comprehension exercises are coming soon! Check back later for updates.
          </Text>
        </View>
      )}

      {selectedCategory === '4' && (
        <View style={styles.comingSoonContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg' }} 
            style={styles.comingSoonImage} 
          />
          <Text style={styles.comingSoonTitle}>Reading Practice</Text>
          <Text style={styles.comingSoonText}>
            Reading comprehension exercises are coming soon! Check back later for updates.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  categoriesScroll: {
    maxHeight: 100,
    marginVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 100,
    height: 80,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategory: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseGerman: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
    marginBottom: 4,
  },
  exerciseEnglish: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  exerciseDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  exerciseDetailGerman: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  exerciseDetailEnglish: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  audioSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F8EF7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
  },
  playButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F74F4F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  recordingButton: {
    backgroundColor: '#6C757D',
  },
  recordButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  successFeedback: {
    backgroundColor: 'rgba(79, 247, 131, 0.1)',
  },
  errorFeedback: {
    backgroundColor: 'rgba(247, 79, 79, 0.1)',
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  successText: {
    color: '#4FF783',
  },
  errorText: {
    color: '#F74F4F',
  },
  tipsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
    flex: 1,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  comingSoonImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    textAlign: 'center',
  },
});

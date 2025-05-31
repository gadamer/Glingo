import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Progress from 'react-native-progress';
import { useStore } from '../../store';

const categories = [
  { id: '1', title: 'Basics', icon: 'book', color: '#4F8EF7', progress: 0.8 },
  { id: '2', title: 'Phrases', icon: 'message-square', color: '#F7C04F', progress: 0.5 },
  { id: '3', title: 'Grammar', icon: 'edit-2', color: '#F74F4F', progress: 0.3 },
  { id: '4', title: 'Vocabulary', icon: 'list', color: '#4FF783', progress: 0.6 },
];

const dailyGoals = [
  { id: '1', title: 'Complete 1 lesson', completed: true },
  { id: '2', title: 'Practice speaking', completed: false },
  { id: '3', title: 'Review vocabulary', completed: true },
];

const lessons = [
  {
    id: '1',
    title: 'Greetings',
    subtitle: 'Learn basic German greetings',
    level: 'Beginner',
    duration: '10 min',
    image: 'https://images.pexels.com/photos/7516347/pexels-photo-7516347.jpeg',
  },
  {
    id: '2',
    title: 'Numbers 1-10',
    subtitle: 'Count from one to ten in German',
    level: 'Beginner',
    duration: '8 min',
    image: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg',
  },
  {
    id: '3',
    title: 'Common Phrases',
    subtitle: 'Essential phrases for daily conversations',
    level: 'Beginner',
    duration: '15 min',
    image: 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg',
  },
];

export default function LearnScreen() {
  const { streak, xp, completedLessons } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('1');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Guten Tag!</Text>
            <Text style={styles.subtitle}>Continue your learning journey</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Feather name="zap" size={16} color="#F7C04F" />
              <Text style={styles.statText}>{xp} XP</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="flame" size={16} color="#F74F4F" />
              <Text style={styles.statText}>{streak} days</Text>
            </View>
          </View>
        </View>

        <View style={styles.dailyGoalsContainer}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          <View style={styles.dailyGoalsList}>
            {dailyGoals.map((goal) => (
              <View key={goal.id} style={styles.goalItem}>
                <View style={[styles.checkbox, goal.completed && styles.checkboxCompleted]}>
                  {goal.completed && <Feather name="check" size={14} color="#fff" />}
                </View>
                <Text style={[styles.goalText, goal.completed && styles.goalTextCompleted]}>
                  {goal.title}
                </Text>
              </View>
            ))}
          </View>
          <Progress.Bar 
            progress={dailyGoals.filter(g => g.completed).length / dailyGoals.length} 
            width={null} 
            height={8}
            color="#4F8EF7"
            unfilledColor="#E1E1E1"
            borderWidth={0}
            borderRadius={4}
            style={styles.progressBar}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color },
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Feather name={category.icon as any} size={24} color="#fff" />
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Progress.Circle 
                  progress={category.progress} 
                  size={40} 
                  thickness={4}
                  color="#fff"
                  unfilledColor="rgba(255,255,255,0.3)"
                  borderWidth={0}
                  style={styles.categoryProgress}
                  formatText={() => `${Math.round(category.progress * 100)}%`}
                  showsText
                  textStyle={styles.progressText}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          {lessons.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={styles.lessonCard}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
              <View style={styles.lessonContent}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                <View style={styles.lessonMeta}>
                  <View style={styles.lessonMetaItem}>
                    <Feather name="bar-chart" size={14} color="#8E8E93" />
                    <Text style={styles.lessonMetaText}>{lesson.level}</Text>
                  </View>
                  <View style={styles.lessonMetaItem}>
                    <Feather name="clock" size={14} color="#8E8E93" />
                    <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    marginLeft: 4,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#212529',
  },
  dailyGoalsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  dailyGoalsList: {
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CED4DA',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4F8EF7',
    borderColor: '#4F8EF7',
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#495057',
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#ADB5BD',
  },
  progressBar: {
    marginTop: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingBottom: 10,
  },
  categoryCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
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
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  categoryProgress: {
    alignSelf: 'flex-end',
  },
  progressText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonImage: {
    width: '100%',
    height: 140,
  },
  lessonContent: {
    padding: 16,
  },
  lessonTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonMetaText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
  },
});

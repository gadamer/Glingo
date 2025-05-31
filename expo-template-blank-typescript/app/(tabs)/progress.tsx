import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const achievements = [
  { 
    id: '1', 
    title: 'First Lesson', 
    description: 'Complete your first lesson', 
    icon: 'award',
    color: '#4F8EF7',
    completed: true,
    progress: 1,
  },
  { 
    id: '2', 
    title: '7-Day Streak', 
    description: 'Learn for 7 consecutive days', 
    icon: 'flame',
    color: '#F74F4F',
    completed: false,
    progress: 0.4,
  },
  { 
    id: '3', 
    title: 'Vocabulary Master', 
    description: 'Learn 100 new words', 
    icon: 'book',
    color: '#F7C04F',
    completed: false,
    progress: 0.65,
  },
  { 
    id: '4', 
    title: 'Perfect Pronunciation', 
    description: 'Get 10 perfect scores in pronunciation exercises', 
    icon: 'mic',
    color: '#4FF783',
    completed: false,
    progress: 0.2,
  },
];

const weeklyActivity = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 80 },
  { day: 'Wed', xp: 150 },
  { day: 'Thu', xp: 90 },
  { day: 'Fri', xp: 0 },
  { day: 'Sat', xp: 0 },
  { day: 'Sun', xp: 0 },
];

const maxXp = Math.max(...weeklyActivity.map(day => day.xp));

export default function ProgressScreen() {
  const { xp, streak, completedLessons } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your learning journey</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(79, 142, 247, 0.1)' }]}>
              <Feather name="zap" size={24} color="#4F8EF7" />
            </View>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(247, 79, 79, 0.1)' }]}>
              <Feather name="flame" size={24} color="#F74F4F" />
            </View>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(79, 247, 131, 0.1)' }]}>
              <Feather name="check-circle" size={24} color="#4FF783" />
            </View>
            <Text style={styles.statValue}>{completedLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.weeklyActivityContainer}>
            {weeklyActivity.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: day.xp > 0 ? (day.xp / maxXp) * 150 : 0,
                        backgroundColor: day.xp > 0 ? '#4F8EF7' : '#E9ECEF',
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.xpLabel}>{day.xp}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Learning Goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily XP Goal</Text>
              <Text style={styles.goalValue}>100 / 100 XP</Text>
            </View>
            <Progress.Bar 
              progress={1} 
              width={null} 
              height={8}
              color="#4F8EF7"
              unfilledColor="#E1E1E1"
              borderWidth={0}
              borderRadius={4}
            />
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Weekly Lesson Goal</Text>
              <Text style={styles.goalValue}>3 / 5 Lessons</Text>
            </View>
            <Progress.Bar 
              progress={0.6} 
              width={null} 
              height={8}
              color="#F7C04F"
              unfilledColor="#E1E1E1"
              borderWidth={0}
              borderRadius={4}
            />
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Vocabulary Goal</Text>
              <Text style={styles.goalValue}>65 / 100 Words</Text>
            </View>
            <Progress.Bar 
              progress={0.65} 
              width={null} 
              height={8}
              color="#F74F4F"
              unfilledColor="#E1E1E1"
              borderWidth={0}
              borderRadius={4}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={[styles.achievementIconContainer, { backgroundColor: achievement.color }]}>
                <Feather name={achievement.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.achievementContent}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  {achievement.completed && (
                    <View style={styles.completedBadge}>
                      <Feather name="check" size={12} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Progress.Bar 
                  progress={achievement.progress} 
                  width={null} 
                  height={6}
                  color={achievement.color}
                  unfilledColor="#E1E1E1"
                  borderWidth={0}
                  borderRadius={3}
                  style={styles.achievementProgress}
                />
              </View>
            </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  weeklyActivityContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 10,
    backgroundColor: '#4F8EF7',
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#495057',
  },
  xpLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
  },
  goalValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
  },
  completedBadge: {
    backgroundColor: '#4FF783',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    marginBottom: 8,
  },
  achievementProgress: {
    marginTop: 4,
  },
});

import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../../store';

const settings = [
  { id: '1', title: 'Daily Reminder', icon: 'bell', type: 'toggle', value: true },
  { id: '2', title: 'Dark Mode', icon: 'moon', type: 'toggle', value: false },
  { id: '3', title: 'Download Lessons', icon: 'download', type: 'toggle', value: true },
  { id: '4', title: 'Account Settings', icon: 'user', type: 'link' },
  { id: '5', title: 'Notification Settings', icon: 'bell', type: 'link' },
  { id: '6', title: 'Privacy Policy', icon: 'shield', type: 'link' },
  { id: '7', title: 'Help & Support', icon: 'help-circle', type: 'link' },
  { id: '8', title: 'About', icon: 'info', type: 'link' },
];

export default function ProfileScreen() {
  const { xp, streak, resetProgress } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex.johnson@example.com</Text>
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Feather name="zap" size={16} color="#4F8EF7" />
                  <Text style={styles.profileStatText}>{xp} XP</Text>
                </View>
                <View style={styles.profileStat}>
                  <Feather name="flame" size={16} color="#F74F4F" />
                  <Text style={styles.profileStatText}>{streak} days</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={16} color="#4F8EF7" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.levelSection}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Current Level</Text>
            <Text style={styles.levelValue}>Beginner</Text>
          </View>
          <View style={styles.levelProgressContainer}>
            <View style={styles.levelProgress}>
              <View 
                style={[
                  styles.levelProgressFill,
                  { width: `${(xp % 100) / 100 * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.levelProgressText}>{xp % 100}/100 XP to next level</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: getIconColor(setting.icon) }]}>
                  <Feather name={setting.icon as any} size={20} color="#fff" />
                </View>
                <Text style={styles.settingTitle}>{setting.title}</Text>
              </View>
              {setting.type === 'toggle' ? (
                <Switch 
                  value={setting.value as boolean} 
                  onValueChange={() => {}} 
                  trackColor={{ false: '#E1E1E1', true: '#4F8EF7' }}
                  thumbColor="#fff"
                />
              ) : (
                <Feather name="chevron-right" size={20} color="#ADB5BD" />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={resetProgress}>
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Reset Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#F74F4F" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function getIconColor(icon: string): string {
  switch (icon) {
    case 'bell':
      return '#F7C04F';
    case 'moon':
      return '#6C5CE7';
    case 'download':
      return '#4F8EF7';
    case 'user':
      return '#4FF783';
    case 'shield':
      return '#F74F4F';
    case 'help-circle':
      return '#00B894';
    case 'info':
      return '#0984E3';
    default:
      return '#4F8EF7';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
  },
  profileStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  profileStatText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#495057',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4F8EF7',
  },
  levelSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
  },
  levelValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#4F8EF7',
  },
  levelProgressContainer: {
    alignItems: 'center',
  },
  levelProgress: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    width: '100%',
    marginBottom: 8,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#4F8EF7',
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212529',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F74F4F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  dangerButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F74F4F',
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#F74F4F',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ADB5BD',
    marginBottom: 24,
  },
});

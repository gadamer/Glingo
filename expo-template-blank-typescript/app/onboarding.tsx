import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useStore } from '../store';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg',
    title: 'Learn German Naturally',
    subtitle: 'Immerse yourself in the language through interactive lessons and real-world scenarios',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg',
    title: 'Track Your Progress',
    subtitle: 'See your improvement over time with detailed statistics and achievements',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg',
    title: 'Practice Speaking',
    subtitle: 'Improve your pronunciation with voice recognition technology',
  },
];

export default function Onboarding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { completeOnboarding } = useStore();

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.slideContainer}>
        <Image
          source={{ uri: slides[activeSlide].image }}
          style={styles.image}
        />
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[activeSlide].title}</Text>
          <Text style={styles.subtitle}>{slides[activeSlide].subtitle}</Text>
          
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {activeSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F8EF7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: width - 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginRight: 8,
  },
});

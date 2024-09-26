import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  Alert,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Prevents the splash screen from auto-hiding until we manually do it
SplashScreen.preventAutoHideAsync(); 

// Define the structure of an Article object for TypeScript
interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

// URL to fetch articles related to Hyderabad from the News API
const API_URL = `https://newsapi.org/v2/everything?q=hyderabad&from=2024-09-24&to=2024-09-24&sortBy=popularity&apiKey=b32957a306184fc0bbe3779e1c750453`;

export default function App() {
  // State hooks to manage articles, current article index, loading status, and content visibility
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);

  // Ref to manage animated value for the swipe unlock feature
  const pan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch articles from the News API on component mount
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        // Set articles in state
        setArticles(data.articles);
        setLoading(false); // Set loading to false once data is fetched
        SplashScreen.hideAsync(); // Hide splash screen after data is loaded
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log any errors
        setLoading(false); // Set loading to false even if there is an error
      });
  }, []);

  // Function to go to the next article
  const handleNext = (): void => {
    if (currentArticleIndex < articles.length - 1) {
      setCurrentArticleIndex(currentArticleIndex + 1); // Increment index
    } else {
      Alert.alert('No more articles'); // Alert if there are no more articles
    }
  };

  // Function to go to the previous article
  const handlePrev = (): void => {
    if (currentArticleIndex > 0) {
      setCurrentArticleIndex(currentArticleIndex - 1); // Decrement index
    } else {
      Alert.alert('You are on the first article'); // Alert if already at the first article
    }
  };

  // Setting up PanResponder for swipe gesture handling
  const panResponder = useRef(
    PanResponder.create({
      // Only activate the responder if the user swipes right
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        gestureState.dx > 5,
      
      // Handle the swipe movement
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx <= 200) { // Limit swipe distance to 200 pixels
          pan.setValue(gestureState.dx); // Update the animated value
        }
      },

      // Handle the release of the swipe gesture
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 150) { // Check if swipe distance exceeds threshold
          Animated.timing(pan, {
            toValue: 200, // Move slider to the end
            duration: 300,
            useNativeDriver: false, // Do not use native driver for animations involving layout
          }).start(() => setShowContent(true)); // Show content if swipe was successful
        } else {
          // If swipe was not far enough, reset to start position
          Animated.timing(pan, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Define style for the animated slider
  const sliderStyle = {
    transform: [{ translateX: pan }], // Transform the slider based on the animated value
  };

  // Loading state view
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading articles...</Text>
      </View>
    );
  }

  // Initial view before content is unlocked
  if (!showContent) {
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderWrapper}>
          <Text style={styles.backgroundText}>Swipe to right</Text>
          <Animated.View style={[styles.slider, sliderStyle]} {...panResponder.panHandlers}>
            <Text style={styles.sliderText}> → </Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Once content is unlocked, display the current article
  const currentArticle = articles[currentArticleIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {currentArticle && (
        <>
          <Image source={{ uri: currentArticle.urlToImage }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{currentArticle.title}</Text>
            <Text style={styles.description}>{currentArticle.description}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Prev" onPress={handlePrev} />
            <Button title="Next" onPress={handleNext} />
          </View>
        </>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30,
  },
  description: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  sliderWrapper: {
    backgroundColor: '#555',
    width: 250,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    borderRadius: 40,
  },
  backgroundText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    transform: [{ translateY: -15 }],
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
  slider: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    height: 35,
  },
});

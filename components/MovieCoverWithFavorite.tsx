import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import { useThemeColor } from '@/components/Themed'; // 🌓
import { Movie } from '@/models/movie.page';
import StorageService from '../services/storage';

interface MovieCoverWithFavoriteProps {
  movie: Movie;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FAVORITE_MOVIES_KEY = 'favoriteMovies';

const MovieCoverWithFavorite: React.FC<MovieCoverWithFavoriteProps> = ({ movie, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  useEffect(() => {
    checkIfFavorite();
  }, [movie.id]);

  const checkIfFavorite = async () => {
    try {
      const favorites = await StorageService.getItem(FAVORITE_MOVIES_KEY);
      if (favorites && Array.isArray(favorites)) {
        const found = favorites.some((favMovie: Movie) => favMovie.id === movie.id);
        setIsFavorite(found);
      }
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      let favorites = await StorageService.getItem(FAVORITE_MOVIES_KEY);
      if (!favorites || !Array.isArray(favorites)) {
        favorites = [];
      }

      if (isFavorite) {
        const updatedFavorites = favorites.filter((favMovie: Movie) => favMovie.id !== movie.id);
        await StorageService.setItem(FAVORITE_MOVIES_KEY, updatedFavorites);
        setIsFavorite(false);
        onToggleFavorite?.();
      } else {
        const alreadyExists = favorites.some((favMovie: Movie) => favMovie.id === movie.id);
        if (!alreadyExists) {
          favorites.push(movie);
          await StorageService.setItem(FAVORITE_MOVIES_KEY, favorites);
          setIsFavorite(true);
          onToggleFavorite?.();
        }
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      Alert.alert('Errore', 'Impossibile aggiornare lo stato dei preferiti.');
    }
  };

  // 🎨 Colori dinamici
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const heartInactiveColor = useThemeColor({}, 'muted');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={{ uri: imageUrl }} style={styles.posterImage} />
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          { backgroundColor: isFavorite ? '#4a1d1d' : 'rgba(0,0,0,0.3)' }
        ]}
        onPress={handleFavoriteToggle}
      >
        <Text style={[styles.heartIcon, { color: isFavorite ? '#e74c3c' : heartInactiveColor }]}>❤</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 10,
    overflow: 'hidden',
    width: width * 0.4,
    aspectRatio: 2 / 3,
    // backgroundColor dinamico
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heartIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieCoverWithFavorite;

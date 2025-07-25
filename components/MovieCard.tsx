import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useThemeColor } from '@/components/Themed'; // Hook per i colori dinamici
import { Movie } from '@/models/movie.page';
import StorageService from '../services/storage';

interface MovieCardProps {
  movie: Movie;
}

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FAVORITE_MOVIES_KEY = 'favoriteMovies';

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

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
      } else {
        const alreadyExists = favorites.some((favMovie: Movie) => favMovie.id === movie.id);
        if (!alreadyExists) {
          favorites.push(movie);
          await StorageService.setItem(FAVORITE_MOVIES_KEY, favorites);
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      Alert.alert('Errore', 'Impossibile aggiornare lo stato dei preferiti.');
    }
  };

  // 🎨 Colori dinamici
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const titleColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitle');
  const overviewColor = useThemeColor({}, 'muted');
  const heartInactiveColor = useThemeColor({}, 'muted');
  const heartButtonBackground = useThemeColor({}, 'favoriteBackground');
  const heartActiveColor = '#e74c3c'; // se vuoi puoi renderlo dinamico anche
  const backgroundButton =useThemeColor({}, 'favSfondo');// se vuoi puoi renderlo dinamico anche
  return (
    <View style={[styles.cardContainer, { backgroundColor }]}>
      <Image source={{ uri: imageUrl }} style={styles.posterImage} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={[styles.releaseDate, { color: subtitleColor }]}>{releaseYear}</Text>
        <Text style={[styles.overview, { color: overviewColor }]} numberOfLines={3}>
          {movie.overview || 'No description available.'}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.voteAverage}>{movie.vote_average.toFixed(1)} / 10</Text>
          <Text style={[styles.voteCount, { color: subtitleColor }]}>
            ({movie.vote_count} votes)
          </Text>
        </View>
      </View>
      <TouchableOpacity
  style={[
    styles.favoriteButton,
    { backgroundColor: isFavorite ? heartButtonBackground : backgroundButton }
  ]}
  onPress={handleFavoriteToggle}
>
  <Text style={[styles.heartIcon, { color: isFavorite ? heartActiveColor : heartInactiveColor }]}>
    ❤
  </Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    margin: 10,
    overflow: 'hidden',
    width: width * 0.9,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  posterImage: {
    width: width * 0.35,
    height: width * 0.35 * 1.5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  overview: {
    fontSize: 13,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteAverage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffc107',
    marginRight: 5,
  },
  voteCount: {
    fontSize: 13,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heartIcon: {
    fontSize: 22,
  },
});

export default MovieCard;

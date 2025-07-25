import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View, useThemeColor } from '@/components/Themed';
import MovieCoverWithFavorite from '@/components/MovieCoverWithFavorite';
import StorageService from '../../services/storage';
import { Movie } from '@/models/movie.page';

const FAVORITE_MOVIES_KEY = 'favoriteMovies';

export default function TabTwoScreen() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const loadingColor = useThemeColor({}, 'tint');
  const subtitleColor = useThemeColor({}, 'muted');
  const errorColor = '#e74c3c'; // Può anche essere reso dinamico se vuoi

  const loadFavoriteMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const movies = await StorageService.getItem(FAVORITE_MOVIES_KEY);
      setFavoriteMovies(Array.isArray(movies) ? movies : []);
    } catch (e) {
      console.error('Errore durante il caricamento dei film preferiti:', e);
      setError('Impossibile caricare i film preferiti.');
      setFavoriteMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteMovies();
      return () => {};
    }, [])
  );

  if (isLoading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={loadingColor} />
        <Text style={[styles.loadingText, { color: titleColor }]}>Caricamento preferiti...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: titleColor }]}>Film da guardare insieme</Text>

      {favoriteMovies.length === 0 ? (
        <Text style={[styles.noMoviesText, { color: subtitleColor }]}>Nessun film aggiunto ai preferiti.</Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          renderItem={({ item }) => (
            <MovieCoverWithFavorite movie={item} onToggleFavorite={loadFavoriteMovies} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  noMoviesText: {
    fontSize: 16,
    marginTop: 50,
    textAlign: 'center',
  },
});

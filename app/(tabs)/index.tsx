import { StyleSheet, FlatList, TextInput } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import { webRequest } from '@/services/web-request';
import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/models/movie.page';

export default function TabOneScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = searchQuery.trim() === ''
        ? 'https://api.themoviedb.org/3/trending/all/week?language=it-IT'
        : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&language=it-IT`;

      const response = await webRequest('get', url, undefined);
      setMovies(response?.results || []);
    } catch (err) {
      console.error('Errore nel recupero dei dati:', err);
      setError('Impossibile caricare i film. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 🎨 Colori dinamici per il TextInput
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const inputBorderColor = useThemeColor({}, 'inputBorder');
  const inputTextColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'placeholder');

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} />
  );

  return (
    <View style={styles.container} lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
            color: inputTextColor
          }
        ]}
        placeholder="Cerca un film o una serie TV..."
        placeholderTextColor={placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading && <Text style={styles.message}>Caricamento film...</Text>}
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      {!loading && !error && movies.length === 0 && (
        <Text style={styles.message}>Nessun risultato trovato.</Text>
      )}
      {!loading && !error && movies.length > 0 && (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.movieList}
          showsVerticalScrollIndicator={false}
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
  searchInput: {
    width: '90%',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  movieList: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginTop: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ff6b6b',
    marginTop: 20,
    textAlign: 'center',
  },
});

import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ImageBackground, Text as RNText, Image } from 'react-native';
import { Text, View } from '@/components/Themed';

const today = new Date(1750363242557).toLocaleDateString('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default function CreditsScreen() {
  return (
    <ImageBackground
      source={{ uri: '' }}
      style={styles.background}
      imageStyle={styles.imageOpacity}
    >
      
      <View style={styles.container}>
      <Image source={require('../assets/images/wip.png')} style={styles.fullScreenImage}/>
        <Text style={styles.title}>Con amore, per chi sa vedere col cuore.</Text>
        <Text style={styles.body}>
          Questa app è un piccolo gesto d’affetto, scritta con amore.
          Ogni riga di codice è la volontà di passare del tempo di qualità con te.
        </Text>
        <Text style={styles.signature}>– emasorz</Text>
        <Text style={styles.subtitle}>un ingegnere informatico simpatico</Text>
        <Text style={styles.date}>{today}</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageOpacity: {
    opacity: 0.15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  body: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  signature: {
    color: '#bbb',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  date: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  fullScreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // oppure 'contain' se vuoi mantenere le proporzioni
    transform: [{ translateY: -300 }], // sposta l'immagine 50 pixel più in alto
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});

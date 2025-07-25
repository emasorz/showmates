import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService = {
  /**
   * Salva un valore associato a una chiave specifica.
   * @param {string} key La chiave da associare al valore.
   * @param {*} value Il valore da salvare (verrà serializzato in JSON se non è una stringa).
   * @returns {Promise<void>} Una Promise che si risolve quando l'operazione è completata.
   */
  setItem: async <T>(key:string, value:T): Promise<void> => {
    try {
      const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
      console.log(`Dato salvato con successo per la chiave: ${key}`);
    } catch (error) {
      console.error(`Errore durante il salvataggio del dato per la chiave ${key}:`, error);
      throw error;
    }
  },

  /**
   * Recupera il valore associato a una chiave specifica.
   * @param {string} key La chiave del valore da recuperare.
   * @returns {Promise<*>} Una Promise che si risolve con il valore recuperato (deserializzato da JSON) o null se non trovato.
   */
  getItem: async (key:string) => {
    try {
      const stringifiedValue = await AsyncStorage.getItem(key);
      if (stringifiedValue === null) {
        console.log(`Nessun dato trovato per la chiave: ${key}`);
        return null;
      }
      try {
        return JSON.parse(stringifiedValue);
      } catch (e) {
        return stringifiedValue;
      }
    } catch (error) {
      console.error(`Errore durante il recupero del dato per la chiave ${key}:`, error);
      throw error;
    }
  },

  /**
   * Rimuove il valore associato a una chiave specifica.
   * @param {string} key La chiave del valore da rimuovere.
   * @returns {Promise<void>} Una Promise che si risolve quando l'operazione è completata.
   */
  removeItem: async (key:string) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Dato rimosso con successo per la chiave: ${key}`);
    } catch (error) {
      console.error(`Errore durante la rimozione del dato per la chiave ${key}:`, error);
      throw error;
    }
  },

  /**
   * Recupera tutte le chiavi memorizzate in AsyncStorage.
   * @returns {Promise<string[]>} Una Promise che si risolve con un array di tutte le chiavi.
   */
  getAllKeys: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('Tutte le chiavi recuperate:', keys);
      return keys;
    } catch (error) {
      console.error('Errore durante il recupero di tutte le chiavi:', error);
      throw error;
    }
  },

  /**
   * Recupera tutte le coppie chiave-valore memorizzate in AsyncStorage.
   * Questo metodo può essere costoso in termini di prestazioni se ci sono molti dati.
   * @returns {Promise<Array<{key: string, value: *}>>} Una Promise che si risolve con un array di oggetti { key, value }.
   */
  getAllItems: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      const allData = items.map(([key, stringifiedValue]) => {
        try {
          return { key, value: JSON.parse(stringifiedValue as string) };
        } catch (e) {
          return { key, value: stringifiedValue }; // Non era un JSON valido
        }
      });

      console.log('Tutti i dati recuperati:', allData);
      return allData;
    } catch (error) {
      console.error('Errore durante il recupero di tutti i dati:', error);
      throw error;
    }
  },

  /**
   * Pulisce tutti i dati memorizzati in AsyncStorage.
   * ATTENZIONE: Usare con cautela, rimuove TUTTO!
   * @returns {Promise<void>} Una Promise che si risolve quando l'operazione è completata.
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      console.log('Tutti i dati sono stati rimossi da AsyncStorage.');
    } catch (error) {
      console.error('Errore durante la pulizia di AsyncStorage:', error);
      throw error;
    }
  }
};

export default StorageService;
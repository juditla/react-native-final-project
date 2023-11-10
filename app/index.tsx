import '../ReactotronConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import UserContext from './UserProvider';

// keeps Splash Screen visible during fetching
SplashScreen.preventAutoHideAsync().catch((error) => console.log(error));

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    // just for testing, shows what is currently in AsyncStorage
    const getAllKeysFromStorage = async () => {
      const allKeys = await AsyncStorage.getAllKeys();

      for (const key of allKeys) {
        const item = await AsyncStorage.getItem(key);
        console.log(`key: ${key}, value: ${JSON.stringify(item)}`);
      }
    };
    getAllKeysFromStorage().catch(() => null);
  }, []);

  useEffect(() => {
    function prepare() {
      // hier Fonts laden falls notwendig
      // hier user credentials verifizieren und dann erst app laden
      setTimeout(() => setIsAppReady(true), 2000);
    }
    try {
      prepare();
    } catch (error) {
      console.log(error);
    }
  });
  if (isAppReady) {
    return <Redirect href="artists" />;
  } else {
    return <Text>Loading</Text>;
  }
}

import '../ReactotronConfig';
import {
  MontserratAlternates_100Thin,
  MontserratAlternates_200ExtraLight,
  MontserratAlternates_300Light,
  MontserratAlternates_400Regular,
  MontserratAlternates_600SemiBold,
  MontserratAlternates_700Bold,
  MontserratAlternates_700Bold_Italic,
  MontserratAlternates_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat-alternates';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import UserContext from './UserProvider';

// keeps Splash Screen visible during fetching
SplashScreen.preventAutoHideAsync().catch((error) => console.log(error));

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const userContext = useContext(UserContext);
  const [fontsLoaded] = useFonts({
    MontserratAlternates_100Thin,
    MontserratAlternates_200ExtraLight,
    MontserratAlternates_300Light,
    MontserratAlternates_400Regular,
    MontserratAlternates_600SemiBold,
    MontserratAlternates_700Bold,
    MontserratAlternates_700Bold_Italic,
    MontserratAlternates_800ExtraBold,
  });

  useEffect(() => {
    function prepare() {
      if (fontsLoaded && userContext?.isInitialLoadingFinished) {
        setIsAppReady(true);
      }
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
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="black" />
      </View>
    );
  }
}

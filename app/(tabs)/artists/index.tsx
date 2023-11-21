import {
  MontserratAlternates_100Thin,
  MontserratAlternates_100Thin_Italic,
  MontserratAlternates_200ExtraLight,
  MontserratAlternates_200ExtraLight_Italic,
  MontserratAlternates_300Light,
  MontserratAlternates_300Light_Italic,
  MontserratAlternates_400Regular,
  MontserratAlternates_400Regular_Italic,
  MontserratAlternates_500Medium,
  MontserratAlternates_500Medium_Italic,
  MontserratAlternates_600SemiBold,
  MontserratAlternates_600SemiBold_Italic,
  MontserratAlternates_700Bold,
  MontserratAlternates_700Bold_Italic,
  MontserratAlternates_800ExtraBold,
  MontserratAlternates_800ExtraBold_Italic,
  MontserratAlternates_900Black,
  MontserratAlternates_900Black_Italic,
  useFonts,
} from '@expo-google-fonts/montserrat-alternates';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router, Stack } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Artist } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import ArtistItem from './ArtistItem';

const renderItem = (item: { item: Artist }) => (
  <ArtistItem artist={item.item} />
);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  rowContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
});

export default function Index() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const userContext = useContext(UserContext);
  const bottomTabHeight = useBottomTabBarHeight();
  let [fontsLoaded] = useFonts({
    MontserratAlternates_100Thin,
    MontserratAlternates_100Thin_Italic,
    MontserratAlternates_200ExtraLight,
    MontserratAlternates_200ExtraLight_Italic,
    MontserratAlternates_300Light,
    MontserratAlternates_300Light_Italic,
    MontserratAlternates_400Regular,
    MontserratAlternates_400Regular_Italic,
    MontserratAlternates_500Medium,
    MontserratAlternates_500Medium_Italic,
    MontserratAlternates_600SemiBold,
    MontserratAlternates_600SemiBold_Italic,
    MontserratAlternates_700Bold,
    MontserratAlternates_700Bold_Italic,
    MontserratAlternates_800ExtraBold,
    MontserratAlternates_800ExtraBold_Italic,
    MontserratAlternates_900Black,
    MontserratAlternates_900Black_Italic,
  });

  useEffect(() => {
    const getArtists = async () => {
      try {
        const response = await fetch(apiDomain + '/artists');
        const json = await response.json();
        setArtists(json);
      } catch (error) {
        console.error(error);
      }
    };
    if (!userContext?.currentUser?.id) {
      router.replace('/login');
    }

    getArtists()
      .then()
      .catch((error) => error);
  }, [userContext]);
  if (!fontsLoaded) {
    return undefined;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.rowContainer}>
          <Text
            variant="headlineMedium"
            style={{ fontFamily: 'MontserratAlternates_400Regular' }}
          >
            Artists
          </Text>
          <Icon source="filter-variant" size={25} />
        </View>
        <FlatList
          data={artists}
          renderItem={renderItem}
          keyExtractor={(artist: Artist) => artist.id.toString()}
          contentContainerStyle={{ paddingBottom: bottomTabHeight }}
        />
      </SafeAreaView>
    );
  }
}

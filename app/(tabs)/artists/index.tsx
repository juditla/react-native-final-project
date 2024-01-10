import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Artist } from '../../../types';
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
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
});

export default function Index() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const bottomTabHeight = useBottomTabBarHeight();

  const getArtists = async () => {
    try {
      const response = await fetch(apiDomain + '/artists');
      const json = await response.json();
      setArtists(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArtists()
      .then()
      .catch((error) => error);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getArtists()
        .then()
        .catch((error) => error);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.rowContainer}>
        <Text variant="headlineMedium" style={styles.highlightFont}>
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

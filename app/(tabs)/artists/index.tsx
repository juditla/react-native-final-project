import { router, Stack } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Artist } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import ArtistItem from './ArtistItem';
import FilterComponent from './FilterComponent';

const renderItem = (item: { item: Artist }) => (
  <ArtistItem artist={item.item} />
);

const styles = StyleSheet.create({
  container: {
    // marginLeft: 10,
    // marginRight: 10,
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.rowContainer}>
        <Text variant="headlineMedium">Artists</Text>
        <Icon source="filter-variant" size={25} />
        {/* <FilterComponent /> */}
      </View>
      <FlatList
        data={artists}
        renderItem={renderItem}
        keyExtractor={(artist: Artist) => artist.id.toString()}
      />
    </SafeAreaView>
  );
}

import { Link, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Artist } from '../../types';
import { apiDomain } from '../studios';
import ArtistItem from './ArtistItem';

const renderItem = (item: { item: Artist }) => (
  <ArtistItem artist={item.item} />
);

export default function Index() {
  const [artists, setArtists] = useState<Artist[]>([]);

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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'tattoo artists',
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTintColor: 'pink',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackVisible: false,
        }}
      />
      <View>
        <Text>Artists</Text>
        <Link href="/" asChild>
          <Pressable>
            <Text>Back</Text>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={artists}
        renderItem={renderItem}
        keyExtractor={(artist: Artist) => artist.id.toString()}
      />
    </>
  );
}

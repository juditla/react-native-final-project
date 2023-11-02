import { router, Stack } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Artist } from '../../../types';
import ArtistItem from '../../old/artists/ArtistItem';
import { apiDomain } from '../../old/studios';
import UserContext from '../../UserProvider';

const renderItem = (item: { item: Artist }) => (
  <ArtistItem artist={item.item} />
);

export default function Index() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const userContext = useContext(UserContext);
  // console.log(userContext);
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
    // console.log('hier bin ich', userContext);
    if (!userContext?.currentUser?.id) {
      router.replace('/login');
    }

    getArtists()
      .then()
      .catch((error) => error);
  }, [userContext]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FlatList
        data={artists}
        renderItem={renderItem}
        keyExtractor={(artist: Artist) => artist.id.toString()}
      />
    </>
  );
}

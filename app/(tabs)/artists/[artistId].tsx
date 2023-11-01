import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Artist, Studio } from '../../../types';
import { apiDomain } from '../studios';

// import { apiDomain } from './';
type Props = {
  params: {
    id: number;
    // artistId: number
  };
};

export default function SingleArtist() {
  const { artistId } = useLocalSearchParams();
  const [artist, setArtist] = React.useState<Artist>();

  const getArtistById = async () => {
    try {
      const response = await fetch(`${apiDomain}/artists/${artistId}`);
      const json = await response.json();
      setArtist(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getArtistById()
      .then()
      .catch((error) => error);
  }, []);

  if (artist) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View>
          <Text>Hi this is Artist</Text>
          <Text>{artist.name}</Text>
          <Text>{artist.style}</Text>
        </View>
      </>
    );
  } else {
    return (
      <View>
        <Text>Sorry we could not find that tattoo artist...</Text>
      </View>
    );
  }
}

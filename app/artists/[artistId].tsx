import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Artist, Studio } from '../../types';

// import { apiDomain } from './';

export default function SingleArtist() {
  const { artistId } = useLocalSearchParams();

  const [artist, setArtist] = React.useState<Artist>();

  const getArtistById = async () => {
    try {
      const response = await fetch('http://localhost:4000/artists/' + artistId);
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
    console.log(artist);
    return (
      <View>
        <Text>Hi this is Artist</Text>
        <Text>{artist.name}</Text>
        <Text>{artist.style}</Text>
      </View>
    );
  } else {
    return (
      <View>
        <Text>Sorry we could not find that tattoo artist...</Text>
      </View>
    );
  }
}

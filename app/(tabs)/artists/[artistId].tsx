import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

const styles = StyleSheet.create({
  image: {
    height: '80%',
    width: '80%',
    margin: 10,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'red',
    margin: 10,
  },
});

export default function SingleArtist() {
  const { artistId } = useLocalSearchParams();
  const [artist, setArtist] = React.useState<Artist>();

  useEffect(() => {
    const getArtistById = async () => {
      try {
        const response = await fetch(`${apiDomain}/artists/${artistId}`);
        const json = await response.json();
        setArtist(json);
      } catch (error) {
        console.error(error);
      }
    };
    getArtistById()
      .then()
      .catch((error) => error);
  }, []);

  if (artist) {
    return (
      <View style={styles.scrollViewContainer}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ScrollView style={styles.scrollView}>
          <View>
            <Text>Hi this is Artist</Text>
            <Text>{artist.name}</Text>
            <Text>{artist.style}</Text>
            <Text>{artist.description}</Text>
            {artist.tattooImages?.map((image) => {
              return (
                <Image
                  style={styles.image}
                  key={`image-${image.id}`}
                  source={image.picture}
                />
              );
            })}
          </View>
        </ScrollView>
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

import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Artist } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

// import { apiDomain } from './';
type Props = {
  params: {
    id: number;
    // artistId: number
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 200,
    width: '95%',
    margin: 10,
    borderRadius: 5,
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 'auto',
  },
  scrollView: {
    // flex: 1,
    margin: 10,
  },
});

export default function SingleArtist() {
  // this is unfortunately the userId of the artist, changing this (either name or value) has led to multiple problems
  const { artistId } = useLocalSearchParams();
  const [artist, setArtist] = useState<Artist>();
  const userContext = useContext(UserContext);

  async function conversationHandler(userId: number, artistId: number) {
    const token = await getSessionFromAsyncStorage();
    try {
      const conversationResponse = await fetch(`${apiDomain}/conversations`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          userId,
          artistId,
          token,
        }),
      });

      const conversation = await conversationResponse.json();
      console.log(conversation);
      return conversation;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const getArtistByUserId = async () => {
      try {
        const response = await fetch(`${apiDomain}/artists/${artistId}`);
        const json = await response.json();
        setArtist(json);
      } catch (error) {
        console.error(error);
      }
    };
    getArtistByUserId()
      .then()
      .catch((error) => error);
  }, [artistId]);

  if (artist) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.container}>
          <Text>Hi this is Artist</Text>
          <Text>{artist.name}</Text>
          <Text>{artist.style}</Text>
          <Text>{artist.description}</Text>
          <Button
            onPress={async () =>
              await conversationHandler(
                userContext?.currentUser?.id,
                Number(artist.id),
              ).then((conversation) => {
                router.push({
                  pathname: `/messages/${conversation[0].id}`,
                  params: {
                    conversationId: conversation[0].id,
                    conversationPartner: artist.name,
                  },
                });
              })
            }
          >
            Start a conversation
          </Button>
          <View style={styles.scrollViewContainer}>
            <ScrollView horizontal={false} style={styles.scrollView}>
              {artist.tattooImages?.map((image) => {
                return (
                  <Image
                    style={styles.image}
                    key={`image-${image.id}`}
                    source={image.picture}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
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

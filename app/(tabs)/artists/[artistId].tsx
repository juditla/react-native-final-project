import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Artist } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

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
  artistContainer: { flex: 1, margin: 20, gap: 10 },
  image: {
    height: 200,
    width: '100%',
    // marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  imageContainer: {
    width: '100%',
    // flex: 1,
    // flexDirection: 'column',
    // alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 15,
    borderRadius: 5,
    gap: 5,
  },
  scrollView: {
    width: '100%',
    alignItems: 'center',
    // margin: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  noArtistContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },

  buttonContainer: {
    color: 'white',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
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
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerBackTitle: '',
            headerTintColor: 'black',
            headerTitle: artist.name.toUpperCase(),
          }}
        />
        <View style={styles.artistContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.rowContainer}>
              <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
                Style:
              </Text>
              <Text variant="bodyLarge" style={{ color: 'grey' }}>
                {artist.style.toLowerCase()}
              </Text>
            </View>
            <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
              Studio:
            </Text>
            <Text variant="bodyLarge" style={{ color: 'grey' }}>
              hier kommt das studio hin
            </Text>
            {/* <TouchableOpacity
              // style={styles.buttonContainer}

            > */}
            <Button
              style={styles.buttonContainer}
              // buttonColor="#474554"
              onPress={async () =>
                await conversationHandler(
                  userContext?.currentUser?.id,
                  Number(artist.id),
                )
                  .then((conversation) => {
                    router.push({
                      pathname: `/messages/${conversation.id}`,
                      params: {
                        conversationId: conversation.id,
                        conversationPartner: artist.name,
                      },
                    });
                  })
                  .catch((error) => error)
              }
              mode="outlined"
              textColor="#474554"
            >
              CONNECT{'  '}
              <IonIcon
                name="chatbubble-ellipses-outline"
                color="#474554"
                size={15}
                style={{ marginLeft: 5 }}
              />
            </Button>
            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.contentContainer}>
            <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
              About:
            </Text>
            <Text variant="bodyLarge" style={{ color: 'grey' }}>
              {artist.description}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Text variant="bodyLarge" style={{ textTransform: 'uppercase' }}>
              My art
            </Text>
            <View style={styles.scrollView}>
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
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.noArtistContainer}>
        <Icon size={30} source="emoticon-sad-outline" />
        <Text style={{ fontSize: 20 }}>
          Sorry we could not find that tattoo artist...
        </Text>
      </View>
    );
  }
}

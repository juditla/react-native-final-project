import { Image } from 'expo-image';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Text } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Artist } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  artistContainer: { flex: 1, margin: 20, gap: 10 },
  image: {
    height: 200,
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  imageContainer: {
    width: '100%',
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // margin: 10,
    gap: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  specialRowContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  noArtistContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    color: 'white',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginLeft: 75,
  },
});

export default function SingleArtist() {
  // bug: this is unfortunately the userId of the artist, changing this (either name or value) has led to multiple problems
  const { artistId } = useLocalSearchParams();
  const [artist, setArtist] = useState<Artist>();
  const userContext = useContext(UserContext);

  async function conversationHandler(
    userId: number,
    artistToStartConversationWithId: number,
  ) {
    const token = await getSessionFromAsyncStorage();
    try {
      const conversationResponse = await fetch(`${apiDomain}/conversations`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          userId,
          artistToStartConversationWithId,
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
  console.log('artist', artist);
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
            <View style={styles.specialRowContainer}>
              <Image
                source={{
                  uri: artist.user.avatar,
                }}
                style={{ height: 70, width: 70, borderRadius: 60 }}
              />
              <View>
                <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                  {artist.user.firstName.toUpperCase()}
                </Text>
                <Text variant="bodyLarge" style={{ color: 'grey' }}>
                  alias '{artist.name}''
                </Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
                Style:
              </Text>
              <Text variant="bodyLarge" style={{ color: 'grey' }}>
                {artist.style.toLowerCase()}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <View>
                <Text
                  style={{ textTransform: 'uppercase' }}
                  variant="bodyLarge"
                >
                  Studio:
                </Text>
                <Link href={`/studios/${artist.studioId}`}>
                  <Text variant="bodyLarge" style={{ color: 'grey' }}>
                    {artist.studio.name}
                  </Text>
                </Link>
              </View>
              <Button
                style={styles.button}
                // buttonColor="#474554"
                onPress={async () =>
                  await conversationHandler(
                    userContext!.currentUser!.id,
                    Number(artist.id),
                  )
                    .then((conversation) => {
                      router.push({
                        pathname: `/messages/${conversation.id}`,
                        params: {
                          conversationId: conversation.id,
                          conversationPartner: artist.user.firstName,
                        },
                      });
                    })
                    .catch((error) => error)
                }
                mode="outlined"
                textColor="white"
              >
                CONNECT{'  '}
                <IonIcon
                  name="chatbubble-ellipses-outline"
                  color="white"
                  size={15}
                  style={{ marginLeft: 5 }}
                />
              </Button>
            </View>
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
            <View style={styles.scrollView}>
              <Text
                variant="bodyLarge"
                style={{ textTransform: 'uppercase', alignSelf: 'flex-start' }}
              >
                My art:
              </Text>
              {/* <Divider horizontalInset={true} bold={true} /> */}
              {artist.tattooImages?.map((image) => {
                return (
                  <View style={styles.imageContainer} key={`image-${image.id}`}>
                    <Image style={styles.image} source={image.picture} />
                    <Divider horizontalInset={true} bold={true} />
                  </View>
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

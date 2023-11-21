import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Icon, Text } from 'react-native-paper';
import { Studio } from '../../../types';
import { apiDomain } from './';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  studioContainer: { flex: 1, margin: 20, gap: 10 },
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
  artistRowContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  noStudioContainer: {
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
    borderRadius: 10,
    backgroundColor: 'black',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginLeft: 75,
  },
});

export default function SingleStudio() {
  // const { studioId } = useLocalSearchParams();
  const { studioId } = useLocalSearchParams();
  const [studio, setStudio] = useState<Studio>();

  console.log('studio', studio?.artist);
  const getStudioById = async () => {
    try {
      const response = await fetch(`${apiDomain}/studios/${studioId}`);
      const json = await response.json();
      setStudio(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getStudioById()
      .then()
      .catch((error) => error);
  }, []);

  if (studio) {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <Stack.Screen
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerBackTitle: '',
              headerTintColor: 'black',
              headerTitle: studio.name.toUpperCase(),
            }}
          />
          <View style={styles.studioContainer}>
            <View style={styles.contentContainer}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                {studio.name.toUpperCase()}
              </Text>
              <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
                Location:
              </Text>
              <Text variant="bodyLarge" style={{ color: 'grey' }}>
                {studio.address}
              </Text>
              <Text variant="bodyLarge" style={{ color: 'grey' }}>
                {studio.postalCode} {studio.city}
              </Text>
              <Button
                mode="outlined"
                textColor="white"
                style={styles.buttonContainer}
                onPress={() => {
                  router.push(
                    `https://www.google.com/maps/search/?api=1&query=${studio.address}+${studio.postalCode}+${studio.city}`,
                  );
                }}
              >
                FIND ON MAP{'  '}
                <Icon
                  source="google-maps"
                  color="white"
                  size={15}
                  // style={{ marginLeft: 5 }}
                />
              </Button>
            </View>
            <View style={styles.contentContainer}>
              <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
                Artists:
              </Text>
              <View>
                {studio.artist.length > 0
                  ? studio.artist.map((artist, index) => {
                      return (
                        <Link
                          key={`artistid-${artist.id}`}
                          style={
                            {
                              //   flexDirection: 'row',
                              // gap: 10,
                              //   alignItems: 'center',
                              //   justifyContent: 'center',
                            }
                          }
                          href={{
                            pathname: `artists/${artist.userId}`,
                            params: { artistId: artist.userId },
                          }}
                        >
                          <Image
                            source={{
                              uri: artist.user.avatar,
                            }}
                            style={{
                              height: 50,
                              width: 50,
                              borderRadius: 50,
                            }}
                          />

                          <Text variant="titleMedium">{artist.name}</Text>
                          <Text variant="titleSmall" style={{ color: 'grey' }}>
                            {artist.style}
                          </Text>
                        </Link>
                      );
                    })
                  : 'no artists'}
              </View>
            </View>
          </View>
          {/* <View style={styles.contentContainer}>
            <Image source={{
              uri:
            }}
            style={{ height: 50, width: 50 }} />
          </View> */}
        </SafeAreaView>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.noStudioContainer}>
        <Icon size={30} source="emoticon-sad-outline" />
        <Text style={{ fontSize: 20 }}>
          Sorry we could not find that tattoo artist...
        </Text>
      </View>
    );
  }
}

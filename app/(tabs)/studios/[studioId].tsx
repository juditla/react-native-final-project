import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  artistRowContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 10,
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
  const { studioId } = useLocalSearchParams();
  const [studio, setStudio] = useState<Studio>();
  const [studioImages, setStudioImages] = useState([]);

  console.log('images:', studioImages);
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
              <Text
                variant="titleLarge"
                style={{ fontFamily: 'MontserratAlternates_600SemiBold' }}
              >
                {studio.name.toUpperCase()}
              </Text>
              <Text
                style={{ textTransform: 'lowercase', color: 'grey' }}
                variant="bodyLarge"
              >
                Location
              </Text>
              <Text variant="bodyLarge">{studio.address}</Text>
              <Text variant="bodyLarge">
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
                <Icon source="google-maps" color="white" size={15} />
              </Button>
            </View>
            <View style={styles.contentContainer}>
              <Text style={{ textTransform: 'uppercase' }} variant="bodyLarge">
                Artists
              </Text>
              <View>
                {studio.artist.length > 0
                  ? studio.artist.map((artist) => {
                      return (
                        <TouchableOpacity
                          key={`artistid-${artist.userId}`}
                          onPress={() =>
                            router.push({
                              pathname: `artists/${artist.userId}`,
                              params: { artistId: artist.userId },
                            })
                          }
                        >
                          <View style={styles.artistRowContainer}>
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

                            <Text
                              variant="titleMedium"
                              style={{
                                fontFamily: 'MontserratAlternates_600SemiBold',
                              }}
                            >
                              {artist.name}
                            </Text>
                            <Text
                              variant="titleSmall"
                              style={{ color: 'grey' }}
                            >
                              {artist.style}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  : undefined}
              </View>
            </View>
            {/* <View style={{ width: '100%' }}>
              {studioImages.length > 0
                ? studioImages.map((image) => {
                    return (
                      <Image
                        key={`imageId-${image.id}`}
                        source={{
                          uri: image.picture,
                        }}
                        style={{
                          height: 200,
                          width: '100%',
                          borderRadius: 5,
                        }}
                      />
                    );
                  })
                : undefined}
            </View> */}
          </View>
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

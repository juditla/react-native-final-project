import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
  highlightFont: {
    fontFamily: 'MontserratAlternates_600SemiBold',
  },
  lowercaseGrey: {
    textTransform: 'lowercase',
    color: 'grey',
  },
  imageStyle: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  greyText: { color: 'grey' },
  font20: { fontSize: 20 },
});

export default function SingleStudio() {
  const { studioId } = useLocalSearchParams();
  const [studio, setStudio] = useState<Studio>();

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
              <Text variant="titleLarge" style={styles.highlightFont}>
                {studio.name.toUpperCase()}
              </Text>
              <Text style={styles.lowercaseGrey} variant="bodyLarge">
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
              <Text style={styles.uppercaseText} variant="bodyLarge">
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
                              style={styles.imageStyle}
                            />

                            <Text
                              variant="titleMedium"
                              style={styles.highlightFont}
                            >
                              {artist.name}
                            </Text>
                            <Text variant="titleSmall" style={styles.greyText}>
                              {artist.style}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  : undefined}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.noStudioContainer}>
        <Icon size={30} source="emoticon-sad-outline" />
        <Text style={styles.font20}>
          Sorry we could not find that tattoo artist...
        </Text>
      </View>
    );
  }
}

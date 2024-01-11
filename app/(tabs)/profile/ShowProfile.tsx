import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { Artist, User } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import ArtistView from './ArtistView';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 60,
  },
  editContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
    margin: 10,
  },
  profileSection: {
    marginHorizontal: 20,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  profileContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addArtistProfileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginVertical: 20,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 25,
    gap: 15,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
  editProfilePictureIcon: { position: 'absolute', right: 110, top: 100 },
  editProfileIcon: {
    alignSelf: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
  },
});

type Props = {
  user: User;
  artist: Artist | undefined;
  setIsEditing: (boolean: boolean) => void;
};

export default function ShowProfile({ user, artist, setIsEditing }: Props) {
  const [profilePicture, setProfilePicture] = useState(
    user.avatar
      ? user.avatar
      : 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
  );
  const userContext = useContext(UserContext);

  const handleUpload = async (base64Image: string, id: number) => {
    const response = await fetch(`${apiDomain}/users/profilepicture`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({ base64Image, id }),
    });
    const newImage = await response.json();
    setProfilePicture(newImage.avatar);

    return response;
  };

  async function changeProfilePicture() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      await handleUpload(result.assets[0].base64, user.id);
    }
  }

  async function handleLogout() {
    // get session & delete in database
    try {
      const sessionJson = await AsyncStorage.getItem('session');
      const session = sessionJson != null ? JSON.parse(sessionJson) : null;

      if (session) {
        const response = await fetch(`${apiDomain}/sessions`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          body: JSON.stringify({ token: session.sessionToken }),
        });
        if (!response.ok) {
          const error = await response.json();
          console.log(error);
        } else {
          // delete session in AsyncStorage
          await AsyncStorage.removeItem('session');
          // set currentUser to null
          userContext?.setCurrentUser(null);
        }
      }
    } catch (error) {
      router.replace('/login');
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.editProfileIcon}
              onPress={() => setIsEditing(true)}
            >
              <Icon source="pencil" size={20} />
            </TouchableOpacity>
            <Image
              style={styles.image}
              source={{
                uri: profilePicture,
              }}
            />
            <TouchableOpacity
              onPress={() => changeProfilePicture()}
              style={styles.editProfilePictureIcon}
            >
              <Icon source="cached" size={25} />
            </TouchableOpacity>

            <Text variant="headlineLarge" style={styles.highlightFont}>
              Hello, {user.firstName}
            </Text>
            <Text variant="bodySmall">
              User since {user.createDate.slice(0, 10)}
            </Text>
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={() => handleLogout()}
            >
              <Text>Logout </Text>
              <Icon source="logout" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {user.roleId === 1 && artist ? (
          <ArtistView artist={artist} />
        ) : (
          <View style={styles.addArtistProfileContainer}>
            <Text>Have you become a tattoo artist?</Text>
            <Button
              mode="contained"
              buttonColor="black"
              onPress={() => router.push(`/registration/artist`)}
            >
              Create tattoo artist account
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

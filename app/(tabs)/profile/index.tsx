// import 'dotenv/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v2 as cloudinary } from 'cloudinary';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import EditProfile from './EditProfile';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: '20%',
    width: '30%',
    borderRadius: 60,
  },
  editContainer: {
    flex: 0.1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
    padding: 20,
  },
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export default function Index() {
  const userContext = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState();
  const [image, setImage] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await fetch(
          `${apiDomain}/artists/${userContext?.currentUser.id}`,
        );
        const json = await response.json();
        setUser(json);
      } catch (error) {
        console.error(error);
      }
    };
    getUserById()
      .then()
      .catch((error) => error);
  }, [userContext]);

  async function handleLogout() {
    // get session & delete in database
    try {
      const sessionJson = await AsyncStorage.getItem('session');
      const session = sessionJson != null ? JSON.parse(sessionJson) : null;

      if (session) {
        console.log('i am here', session);
        const response = await fetch(`${apiDomain}/sessions`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          body: JSON.stringify({ token: session.sessionToken }),
        });
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message);
        } else {
          router.push('/login');
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    // delete session from AsyncStorage
    try {
      await AsyncStorage.removeItem('session');
    } catch (error) {
      return console.log('could not delete async storage');
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // const uploadImage = async () => {
  //   cloudinary.v2.uploader.upload(
  //     image,
  //     { public_id: imageName },
  //     function (error, result) {
  //       console.log(result);
  //     },
  //   );
  // };

  if (isEditing) {
    return (
      <View>
        <EditProfile />
      </View>
    );
  } else {
    if (userContext?.currentUser?.roleId === 2) {
      // getUser

      // Button to edit profile (password, email)
      // Become an artist

      // For artist: upload pictures
      return (
        <>
          <View style={styles.editContainer}>
            <Button onPress={() => setIsEditing(true)}>
              <Icon source="pencil" size={20} />
            </Button>
          </View>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://i.pinimg.com/originals/69/a2/0f/69a20f93a18f403b613fe60678ae5801.jpg',
              }}
            />
            <Text variant="headlineMedium">
              Hello, {userContext.currentUser.firstName}
            </Text>
            <Text variant="bodySmall">User since 10/12</Text>
            <Button onPress={() => handleLogout()}>
              <Text>Logout</Text>
            </Button>
            <Text>{errorMessage}</Text>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.editContainer}>
            <Button onPress={() => setIsEditing(true)}>
              <Icon source="pencil" size={20} />
            </Button>
          </View>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://i.pinimg.com/originals/69/a2/0f/69a20f93a18f403b613fe60678ae5801.jpg',
              }}
            />
            <Text variant="headlineMedium">
              Hello, {userContext?.currentUser?.firstName}
            </Text>
            <Text variant="bodySmall">User since 10/12</Text>
            <Text>You are an artist</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <Button onPress={pickImage}>
                Pick an image from camera roll
              </Button>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              )} */}
            </View>
            <Button onPress={() => handleLogout()}>
              <Text>Logout</Text>
            </Button>
            <Text>{errorMessage}</Text>
          </View>
        </>
      );
    }
  }
}

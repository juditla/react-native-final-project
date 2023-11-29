import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  button: {
    marginTop: 25,
    borderRadius: 15,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 40,
    alignSelf: 'center',
  },
  highlightText: {
    fontFamily: 'MontserratAlternates_600SemiBold',
    alignSelf: 'center',
    marginTop: 40,
  },
});

export default function ProfilePicture() {
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const userContext = useContext(UserContext);
  const router = useRouter();

  const handleUpload = async (base64Image: string, id: number) => {
    try {
      const response = await fetch(
        `${apiDomain}/users/profilepicture/${userContext?.currentUser?.id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ base64Image, id }),
        },
      );
      const newImage = await response.json();
      setProfilePicture(newImage.avatar);
    } catch (error) {
      setErrorMessage('Something went wrong uploading the picture');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      await handleUpload(result.assets[0].base64, userContext!.currentUser!.id);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text variant="headlineMedium" style={styles.highlightText}>
        Profile picture
      </Text>
      {profilePicture ? (
        <Image
          source={{
            uri: profilePicture,
          }}
          style={styles.image}
        />
      ) : undefined}
      <View style={styles.container}>
        <Button
          mode="contained"
          buttonColor="black"
          textColor="white"
          style={styles.button}
          onPress={() => pickImage()}
        >
          Choose picture
        </Button>
        <Button
          style={styles.button}
          mode="outlined"
          textColor="black"
          onPress={() => {
            if (userContext?.currentUser?.roleId === 1) {
              router.push('/registration/artist');
            } else {
              router.push('/artists');
            }
          }}
        >
          Continue
        </Button>
        <Text>{errorMessage}</Text>
      </View>
    </SafeAreaView>
  );
}

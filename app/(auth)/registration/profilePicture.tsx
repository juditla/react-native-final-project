import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ProfilePicture() {
  const [profilePicture, setProfilePicture] = useState(undefined);
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
      setProfilePicture(newImage);

      return response;
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
    <View style={styles.container}>
      <Text variant="bodyLarge">Your profile picture</Text>
      <Image
        source={{
          uri: profilePicture,
        }}
        style={{ width: 80, height: 80 }}
      />
      <TouchableOpacity onPress={() => pickImage()}>
        <Text>Choose picture</Text>
      </TouchableOpacity>
      <Button
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
  );
}

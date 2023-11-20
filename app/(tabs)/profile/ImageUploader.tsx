import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { TattooImage } from '../../../types';
import { apiDomain } from '../studios';

type Props = {
  artistId: number;
  setTattooImages: (tattooImages: TattooImage[]) => void;
  tattooImages: TattooImage[];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'center',
    marginLeft: 20,
  },
  iconButton: {
    padding: 10,
  },
});

export default function ImageUploader({
  artistId,
  setTattooImages,
  tattooImages,
}: Props) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = async (base64Image: string, id: number) => {
    const response = await fetch(`${apiDomain}/tattooimages`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ base64Image, id }),
    });
    const newImage = await response.json();
    setTattooImages([...tattooImages, newImage]);

    return response;
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
      await handleUpload(result.assets[0].base64, artistId);
    }
  };

  const takePicture = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted) {
      const data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
        base64: true,
      });
      if (!data.canceled && data.assets[0]?.base64) {
        await handleUpload(data.assets[0].base64, artistId);
      }
    } else {
      setErrorMessage('Permission to access camera is needed to proceed');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="bodyLarge">Upload new picture</Text>
      <TouchableOpacity style={styles.iconButton} onPress={() => pickImage()}>
        <Icon source="image-multiple" size={25} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => takePicture()}>
        <Icon source="camera" size={25} />
      </TouchableOpacity>
      <Text>{errorMessage}</Text>
    </View>
  );
}

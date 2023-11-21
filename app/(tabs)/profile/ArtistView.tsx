import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Artist } from '../../../types';
import { apiDomain } from '../studios';
import ImageUploader from './ImageUploader';

type Props = {
  artist: Artist;
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: '90%',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  imageSection: {
    marginTop: 5,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
});

export default function ArtistView({ artist }: Props) {
  const [tattooImages, setTattooImages] = useState(artist.tattooImages);

  const deleteImageHandler = async (id: number) => {
    const delteImageResponse = await fetch(`${apiDomain}/tattooimages/${id}`, {
      method: 'DELETE',
    });
    const deletedImage = await delteImageResponse.json();
    const newTattooImages = tattooImages?.filter(
      (image) => image.id !== deletedImage.id,
    );
    setTattooImages(newTattooImages);
  };
  return (
    <View style={styles.imageSection}>
      <ImageUploader
        setTattooImages={setTattooImages}
        artistId={artist.id}
        tattooImages={tattooImages}
      />
      <View>
        <View style={styles.container}>
          <Text variant="bodyLarge" style={{ marginLeft: 10 }}>
            Your images
          </Text>
          {tattooImages?.map((image) => {
            console.log(image);
            return (
              <View style={styles.imageContainer} key={`image-${image.id}`}>
                <Image style={styles.image} source={image.picture} />
                <TouchableOpacity
                  onPress={async () => {
                    await deleteImageHandler(image.id);
                  }}
                >
                  <Icon source="trash-can-outline" size={25} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

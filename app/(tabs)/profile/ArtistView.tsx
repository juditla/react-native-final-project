import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Artist } from '../../../types';
import { apiDomain } from '../studios';
import ImageUploader from './ImageUploader';

type Props = {
  artist: Artist;
};

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '50%',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    height: '50%',
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
    <ScrollView>
      <View style={styles.container}>
        {tattooImages?.map((image) => {
          console.log(image);
          return (
            <View style={styles.imageContainer} key={`image-${image.id}`}>
              <Image style={styles.image} source={image.picture} />
              <Button
                onPress={async () => {
                  await deleteImageHandler(image.id);
                }}
              >
                X
              </Button>
            </View>
          );
        })}
        <View>
          <ImageUploader
            setTattooImages={setTattooImages}
            artistId={artist.id}
            tattooImages={tattooImages}
          />
        </View>
      </View>
    </ScrollView>
  );
}

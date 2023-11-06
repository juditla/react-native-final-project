import { Image } from 'expo-image';
// import * as Permissions from 'expo-permissions';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Artist, TattooImage } from '../../../types';
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

const deleteImageHandler = async (id: number) => {
  const delteImageResponse = await fetch(`${apiDomain}/tattooimages/${id}`, {
    // headers: { 'Content-Type': 'application/json' },
    method: 'DELETE',
  });
};

export default function ArtistView({ artist }: Props) {
  const [tattooImages, setTattooImages] = useState(artist.tattooImages);
  // console.log(artist);
  // console.log(artist.tattooImages);
  return (
    <ScrollView>
      <View style={styles.container}>
        {tattooImages?.map((image) => {
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

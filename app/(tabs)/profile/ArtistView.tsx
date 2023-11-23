import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Icon, Text } from 'react-native-paper';
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
    gap: 20,
    // width: '100%',
    backgroundColor: 'white',
    marginHorizontal: 20,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    // padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  imageSection: {
    // marginTop: 5,
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
          <Text
            variant="bodyLarge"
            style={{
              marginLeft: 10,
              fontFamily: 'MontserratAlternates_600SemiBold',
            }}
          >
            your images
          </Text>
          {tattooImages && tattooImages.length === 0 ? (
            <Text style={{ marginLeft: 10 }}>
              you don't have any images yet..
            </Text>
          ) : (
            tattooImages?.map((image) => {
              return (
                <View style={{ gap: 20 }} key={`image-${image.id}`}>
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={image.picture} />
                    <TouchableOpacity
                      onPress={async () => {
                        await deleteImageHandler(image.id);
                      }}
                    >
                      <Icon source="trash-can-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <Divider horizontalInset={true} bold={true} />
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}

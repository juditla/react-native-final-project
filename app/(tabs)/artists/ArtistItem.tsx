import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Artist } from '../../../types';

type Props = {
  artist: Artist;
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

export default function ArtistItem({ artist }: Props) {
  let pictureUri =
    'https://media.istockphoto.com/id/944433918/photo/back-tattoo-of-a-woman.jpg?s=612x612&w=0&k=20&c=d7CnC4esWn-VlnmETYoxvODoiubywnb9VXju5r1pVx8=';
  if (artist.tattooImages && artist.tattooImages[0]) {
    pictureUri = artist.tattooImages[0].picture;
  }
  return (
    <View style={styles.container}>
      <Card style={styles.container}>
        <Card.Title title={artist.name} />
        <Card.Cover
          style={styles.container}
          source={{
            uri: pictureUri,
          }}
        />
        <Card.Actions>
          <Link
            href={{
              pathname: `artists/${artist.userId}`,
              params: { artistId: artist.userId },
            }}
            asChild
          >
            <Button>Go to artist</Button>
          </Link>
        </Card.Actions>
      </Card>
    </View>
  );
}

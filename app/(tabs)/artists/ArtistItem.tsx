import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Icon, Paragraph, Text, Title } from 'react-native-paper';
import { Artist } from '../../../types';

type Props = {
  artist: Artist;
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  linkStyle: {
    color: 'black',
  },
  cardContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    borderRadius: 10,
  },
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
  rating: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
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
        <Card.Cover
          style={styles.container}
          source={{
            uri: pictureUri,
          }}
        />
        <View style={styles.cardContent}>
          <Card.Content>
            <Title style={styles.highlightFont}>
              {artist.name.toUpperCase()}
            </Title>
            <Paragraph>{artist.style.toLowerCase()}</Paragraph>
            <View style={styles.rating}>
              <Icon size={20} source="star" />
              <Text>
                {artist.ratingAverage} ({artist.ratingCount})
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Link
              href={{
                pathname: `artists/${artist.userId}`,
                params: { artistId: artist.userId },
              }}
              asChild
            >
              <Button style={styles.button} mode="outlined" textColor="black">
                See more
              </Button>
            </Link>
          </Card.Actions>
        </View>
      </Card>
    </View>
  );
}

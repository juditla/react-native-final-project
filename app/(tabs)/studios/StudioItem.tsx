import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Paragraph,
  Text,
  Title,
} from 'react-native-paper';
import { Studio } from '../../../types';

type Props = {
  studio: Studio;
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    borderRadius: 10,
  },
});
export default function StudioItem({ studio }: Props) {
  let pictureUri =
    'https://media.istockphoto.com/id/944433918/photo/back-tattoo-of-a-woman.jpg?s=612x612&w=0&k=20&c=d7CnC4esWn-VlnmETYoxvODoiubywnb9VXju5r1pVx8=';
  if (studio.tattooImages && studio.tattooImages[0]) {
    pictureUri = studio.tattooImages[0].picture;
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
            <Title>{studio.name.toUpperCase()}</Title>
            <Paragraph>
              {studio.postalCode} {studio.city}
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Link
              href={{
                pathname: `/studios/${studio.id}`,
                params: { studioId: studio.id },
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

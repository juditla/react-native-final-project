import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Studio } from '../../../types';

type Props = {
  studio: Studio;
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

export default function StudioItem({ studio }: Props) {
  // const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;
  return (
    <>
      <View style={styles.container}>
        <Card>
          <Card.Title
            title={studio.name}
            // subtitle={`${studio.address}, ${studio.postalCode} ${studio.city}`}
            // left={LeftContent}
          />
          <Card.Content>
            {/* <Text variant="titleLarge">{studio.name}</Text> */}
            {/* <Text variant="bodyMedium">{studio.address}</Text>
          <Text variant="bodyMedium">
            {studio.postalCode} {studio.city}
          </Text> */}
          </Card.Content>
          <Card.Cover
            source={{
              uri: 'https://media.istockphoto.com/id/944433918/photo/back-tattoo-of-a-woman.jpg?s=612x612&w=0&k=20&c=d7CnC4esWn-VlnmETYoxvODoiubywnb9VXju5r1pVx8=',
            }}
          />
          <Card.Actions>
            <Button
              onPress={() => {
                router.push({
                  pathname: `/studios/${studio.id}`,
                  params: { id: Number(studio.id) },
                });
              }}
            >
              Go to studio
            </Button>
          </Card.Actions>
        </Card>
      </View>
      {/* <View style={styles.container}>
        <Text>{studio.name}</Text>
        <Link
          href={{
            pathname: `/studios/${studio.id}`,
            params: { id: studio.id },
          }}
        >
          Go to studio
        </Link>
      </View> */}
    </>
  );
}

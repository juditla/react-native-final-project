import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Artist, Studio } from '../../types';

type Props = {
  artist: Artist;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECF0F1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    margin: 10,
    borderWidth: 2,
  },
});

export default function ArtistItem({ artist }: Props) {
  return (
    <View style={styles.container}>
      <Text>{artist.name}</Text>
      <Link
        href={{
          pathname: `/artists/${artist.id}`,
          params: { id: artist.id },
        }}
      >
        Go to artist
      </Link>
    </View>
  );
}

import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Studio } from '../../types';

type Props = {
  studio: Studio;
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

export default function StudioItem({ studio }: Props) {
  return (
    <View style={styles.container}>
      <Text>{studio.name}</Text>
      <Link
        href={{
          pathname: `/studios/${studio.id}`,
          params: { id: studio.id },
        }}
      >
        Go to studio
      </Link>
    </View>
  );
}

import { StyleSheet, View } from 'react-native';
import ArtistRegistrationForm from './ArtistRegistrationForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ArtistRegistrationPage() {
  return (
    <View style={styles.container}>
      <ArtistRegistrationForm />
    </View>
  );
}

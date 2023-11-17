import { StyleSheet, View } from 'react-native';
import RegistrationForm from './RegistrationForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function RegistrationPage() {
  return (
    <View style={styles.container}>
      <RegistrationForm />
    </View>
  );
}

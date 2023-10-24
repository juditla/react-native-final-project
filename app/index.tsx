import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
  },
  button: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    margin: 10,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: 'xxx',
        }}
      />
      <Link href="/studios" asChild style={styles.button}>
        <Pressable>
          <Text>Studios</Text>
        </Pressable>
      </Link>
      <TouchableOpacity style={styles.button}>
        <Link href="/artists" asChild>
          <Text>Artists</Text>
        </Link>
      </TouchableOpacity>
      <Link href="/messages" asChild style={styles.button}>
        <TouchableOpacity>
          <Text>Messages</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/user" asChild style={styles.button}>
        {/* <Pressable> */}
        <Text>Profile</Text>
        {/* </Pressable> */}
      </Link>
      <Link href="/registration" asChild style={styles.button}>
        {/* <Pressable> */}
        <Text>Register</Text>
        {/* </Pressable> */}
      </Link>
      <Link href="/login" asChild style={styles.button}>
        {/* <Pressable> */}
        <Text>Login</Text>
        {/* </Pressable> */}
      </Link>
      <StatusBar style="auto" />
    </View>
  );
}

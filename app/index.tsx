import '../ReactotronConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiDomain } from './studios';

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
  const [errorMessage, setErrorMessage] = useState('');

  // just for testing, shows what is currently in AsyncStorage
  useEffect(() => {
    const getAllKeysFromStorage = async () => {
      const allKeys = await AsyncStorage.getAllKeys();

      for (const key of allKeys) {
        const item = await AsyncStorage.getItem(key);
        console.log(`key: ${key}, value: ${JSON.stringify(item)}`);
      }
    };
    getAllKeysFromStorage().catch(() => null);
  }, []);

  async function handleLogout() {
    // get session & delete in database
    try {
      const sessionJson = await AsyncStorage.getItem('session');
      const session = sessionJson != null ? JSON.parse(sessionJson) : null;

      if (session) {
        console.log('i am here', session);
        const response = await fetch(`${apiDomain}/sessions`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          body: JSON.stringify({ token: session.sessionToken }),
        });
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message);
        } else {
          router.push('/login');
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    // delete session from AsyncStorage
    try {
      await AsyncStorage.removeItem('session');
    } catch (error) {
      return console.log(error);
    }
  }

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
      <Button
        onPress={async () => await handleLogout()}
        title="Logout"
        color="#841584"
        accessibilityLabel="Login"
      />
      <Text>{errorMessage}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { apiDomain } from '../studios';
import LoginForm from './LoginForm';

// type Props = { searchParams: { returnTo?: string | string[] } };

export default function Login() {
  const getSessionFromAsyncStorage = async () => {
    const jsonSessionFromAsyncStorage = await AsyncStorage.getItem('session');
    console.log(jsonSessionFromAsyncStorage);
    return jsonSessionFromAsyncStorage != null
      ? JSON.parse(jsonSessionFromAsyncStorage)
      : null;
  };

  const getValidDatabaseSession = async (token: string) => {
    const response = await fetch(`${apiDomain}/sessions`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ token: token }),
    });
    return response;
  };

  useEffect(() => {
    getSessionFromAsyncStorage()
      .then((session) => {
        const now = new Date();
        const isStoredSessionValid = session.expiresAt > now.toISOString();
        console.log('here', isStoredSessionValid);

        getValidDatabaseSession(session.sessionToken)
          .then((response) => {
            if (isStoredSessionValid && response.ok) {
              console.log('response', response.ok);
              router.push(`/artists`);
            }
          })

          .catch((error) => console.log(error));
      })
      .catch(() => null);
  }, []);
  // const jsonValue = await AsyncStorage.getItem('my-key');
  // return jsonValue

  // 2. Check if the sessionToken cookie is still valid
  // const validSession =
  //   sessionToken &&
  //   (await getValidSessionByToken(sessionTokenCookie.value));

  // // 3. If the sessionToken cookie is valid, redirect to home

  // if (validSessionsession) router.redirect('/');

  return (
    <View>
      <LoginForm />
    </View>
  );
}

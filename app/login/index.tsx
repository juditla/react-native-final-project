import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { apiDomain } from '../studios';
import LoginForm from './LoginForm';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  // get session from async storage
  const getSessionFromAsyncStorage = async () => {
    const jsonSessionFromAsyncStorage = await AsyncStorage.getItem('session');
    return jsonSessionFromAsyncStorage != null
      ? JSON.parse(jsonSessionFromAsyncStorage)
      : null;
  };
  // send token to check if there is a corresponding valid session in database
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
        // check if session is already expired
        const now = new Date();
        const isStoredSessionValid = session.expiresAt > now.toISOString();
        console.log('here', isStoredSessionValid);

        getValidDatabaseSession(session.sessionToken)
          .then((response) => {
            if (isStoredSessionValid && response.ok) {
              console.log('response', response.ok);
              router.push(`/artists`);
            } else {
              setErrorMessage('session not valid');
            }
          })

          .catch((error) => setErrorMessage(error));
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
      <Text>{errorMessage}</Text>
      <LoginForm />
    </View>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';
import LoginForm from './LoginForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const userContext = useContext(UserContext);
  // get session from async storage

  useEffect(() => {
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

    getSessionFromAsyncStorage()
      .then((session) => {
        // check if session is already expired
        const now = new Date();
        const isStoredSessionValid = session.expiresAt > now.toISOString();

        getValidDatabaseSession(session.sessionToken)
          .then((response) => {
            if (isStoredSessionValid && response.ok) {
              if (userContext) {
                userContext.updateUserForSession(session.token, () =>
                  router.replace(`/artists`),
                );
              }
            } else {
              setErrorMessage('session not valid');
            }
          })

          .catch((error) => setErrorMessage(error));
      })
      .catch(() => null);
  }, []);

  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiDomain } from '../app/(tabs)/studios';

export const deleteInvalidSessionFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem('session');
  } catch (error) {
    return console.log(error);
  }
};

export const getSessionFromAsyncStorage = async () => {
  const jsonSessionFromAsyncStorage = await AsyncStorage.getItem('session');
  if (jsonSessionFromAsyncStorage != null) {
    const session = JSON.parse(jsonSessionFromAsyncStorage);
    const now = Date.now();
    // check if token is still valid
    if (session.expiresAt > now) {
      return session.sessionToken;
    } else {
      // call delete session function if not valid but still in async storage
      await deleteInvalidSessionFromAsyncStorage();
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const getValidDatabaseSession = async (token: string) => {
  const response = await fetch(`${apiDomain}/sessions`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ token: token }),
  });
  if (response.ok) {
    const userFromToken = await response.json();

    return userFromToken;
  } else {
    return undefined;
  }
};

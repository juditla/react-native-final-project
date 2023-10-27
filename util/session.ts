import AsyncStorage from '@react-native-async-storage/async-storage';

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
    if (Date.parse(session.expiresAt) > now) {
      return session.sessionToken;
    } else {
      // call delete session function if not valid but still in async storage
      await deleteInvalidSessionFromAsyncStorage();
      return undefined;
    }
  } else {
    console.log('no valid session');
    return undefined;
  }
};

// const getValidDatabaseSession = async (token: string) => {
//   const response = await fetch(`${apiDomain}/sessions`, {
//     headers: { 'Content-Type': 'application/json' },
//     method: 'POST',
//     body: JSON.stringify({ token: token }),
//   });
//   return response;
// };

// getSessionFromAsyncStorage()
//   .then((session) => {
//     const now = new Date();
//     const isStoredSessionValid = session.expiresAt > now.toISOString();
//     console.log('here', isStoredSessionValid);
//     getValidDatabaseSession(session.sessionToken)
//       .then((response) => {
//         if (isStoredSessionValid && response.ok) {
//           console.log('response', response.ok);
//           router.push(`/artists`);
//         }
//       })

//       .catch((error) => console.log(error));
//   })
//   .catch(() => null);

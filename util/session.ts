import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSessionFromAsyncStorage = async () => {
  const jsonSessionFromAsyncStorage = await AsyncStorage.getItem('session');
  if (jsonSessionFromAsyncStorage != null) {
    console.log('here');
    const session = JSON.parse(jsonSessionFromAsyncStorage);
    console.log(session.sessionToken, Date.parse(session.expiresAt));
    const now = Date.now();
    console.log(now);
    return Date.parse(session.expiresAt) > now
      ? session.sessionToken
      : undefined;
  } else {
    console.log('there');
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { Artist, User } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import ArtistView from './ArtistView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: '20%',
    width: '30%',
    borderRadius: 60,
  },
  editContainer: {
    // flex: 0.1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
    padding: 20,
  },
});

type Props = {
  user: User;
  artist: Artist | undefined;
  setIsEditing: (boolean: boolean) => void;
};

export default function ShowProfile({ user, artist, setIsEditing }: Props) {
  // const userContext = useContext(UserContext);

  async function handleLogout() {
    // get session & delete in database
    try {
      const sessionJson = await AsyncStorage.getItem('session');
      const session = sessionJson != null ? JSON.parse(sessionJson) : null;

      if (session) {
        const response = await fetch(`${apiDomain}/sessions`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          body: JSON.stringify({ token: session.sessionToken }),
        });
        const data = await response.json();
        if (!response.ok) {
          // setErrorMessage(data.message);
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
      return console.log('could not delete async storage');
    }
  }
  return (
    <>
      <View style={styles.editContainer}>
        <Button onPress={() => setIsEditing(true)}>
          <Icon source="pencil" size={20} />
        </Button>
      </View>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://i.pinimg.com/originals/69/a2/0f/69a20f93a18f403b613fe60678ae5801.jpg',
          }}
        />
        <Text variant="headlineMedium">Hello, {user.firstName}</Text>
        <Text variant="bodySmall">
          User since {user.createDate.slice(0, 10)}
        </Text>
        <Button onPress={() => handleLogout()}>
          <Text>Logout</Text>
        </Button>
        {user.roleId === 1 && artist ? (
          <ArtistView artist={artist} />
        ) : undefined}

        {/* was solte hier sein?
      - artist name,  description, style, studio
      - Liste mit bildern - kleines bild + name des bildes + m
      - Bild hinzufügen
      - dafür muss ich auch artist holen  */}
      </View>
    </>
  );
}

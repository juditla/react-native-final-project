import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Switch, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { Artist, User } from '../../../types';
import { apiDomain } from '../studios';
import ChangePassword from './ChangePassword';

type Props = {
  user: User;
  artist: Artist | undefined;
  setIsEditing: (boolean: boolean) => void;
};

const userToUpdateSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

const artistToUpdateSchema = z.object({
  name: z.string().min(3),
  style: z.string().min(3),
  description: z.string().min(3),
});

const styles = StyleSheet.create({
  container: {
    margin: 30,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrapper: {
    marginTop: 10,
  },
  button: {
    marginTop: 25,
    borderRadius: 15,
  },
  inputStyle: {
    borderRadius: 15,
  },
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
});

export default function EditProfile({ user, artist, setIsEditing }: Props) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [errorMessage, setErrorMessage] = useState('');
  const [artistName, setArtistName] = useState(artist?.name);
  const [artistStyle, setArtistStyle] = useState(artist?.style);
  const [artistDescription, setArtistDescription] = useState(
    artist?.description,
  );
  const [changePassword, setChangePassword] = useState(false);

  async function deletionHandler(id: number, databaseToDeleteFrom: string) {
    const deletionResponse = await fetch(
      `${apiDomain}/${databaseToDeleteFrom}/${id}`,
      {
        method: 'DELETE',
      },
    );
    if (!deletionResponse.ok) {
      setErrorMessage(
        `There was a problem deleting your ${databaseToDeleteFrom.slice(
          0,
          -1,
        )}`,
      );
    } else {
      if (databaseToDeleteFrom === 'users') {
        router.push('/login');
      } else {
        setIsEditing(false);
      }
    }
  }
  async function updateUserHandler() {
    const userToUpdate = {
      email: user.email,
      firstName,
      lastName,
    };
    const validatedUserToUpdate = userToUpdateSchema.safeParse({
      firstName,
      lastName,
    });
    if (!validatedUserToUpdate.success) {
      setErrorMessage('First and last name must be at least 3 characters');
    } else {
      const response = await fetch(`${apiDomain}/users/${user.id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(userToUpdate),
      });

      try {
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message);
        } else {
          setIsEditing(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function updateArtistHandler() {
    if (artist) {
      const artistToUpdate = {
        name: artistName,
        style: artistStyle,
        description: artistDescription,
      };
      const validatedArtistToUpdate = artistToUpdateSchema.safeParse({
        name: artistName,
        style: artistStyle,
        description: artistDescription,
      });
      if (!validatedArtistToUpdate.success) {
        setErrorMessage('Artist input not correct');
      } else {
        const response = await fetch(`${apiDomain}/artists/${artist.id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify(artistToUpdate),
        });

        try {
          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(data.message);
          } else {
            setIsEditing(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrapper}>
          <Text variant="headlineMedium" style={styles.highlightFont}>
            Edit your profile
          </Text>
        </View>
        <View style={styles.wrapper}>
          <TextInput
            label="First name"
            mode="outlined"
            activeOutlineColor="black"
            outlineColor="grey"
            outlineStyle={styles.inputStyle}
            onChangeText={(val: string) => setFirstName(val)}
            value={firstName}
            keyboardType="default"
            autoComplete="given-name"
          />
        </View>
        <View style={styles.wrapper}>
          <TextInput
            label="Last name"
            mode="outlined"
            activeOutlineColor="black"
            outlineColor="grey"
            outlineStyle={styles.inputStyle}
            onChangeText={(val: string) => setLastName(val)}
            value={lastName}
            keyboardType="default"
            autoComplete="given-name"
          />
        </View>
        <View style={styles.rowContainer}>
          <Text>Change Password?</Text>
          <Switch
            value={changePassword}
            onValueChange={() => setChangePassword(!changePassword)}
            color="black"
          />
        </View>
        {changePassword ? <ChangePassword user={user} /> : undefined}
        <Button
          onPress={async () => {
            await updateUserHandler();
          }}
          mode="contained"
          buttonColor="black"
          textColor="white"
          style={styles.button}
        >
          Save
        </Button>
        <Button
          icon="trash-can-outline"
          onPress={async () => {
            await deletionHandler(user.id, 'users');
          }}
          style={styles.button}
          mode="outlined"
          textColor="black"
        >
          Delete profile
        </Button>
        <Text>{errorMessage}</Text>
        {user.roleId === 1 ? (
          <View>
            <View style={styles.wrapper}>
              <TextInput
                label="Artist name"
                mode="outlined"
                activeOutlineColor="black"
                outlineColor="grey"
                outlineStyle={styles.inputStyle}
                onChangeText={(val: string) => setArtistName(val)}
                value={artistName}
                keyboardType="default"
              />
            </View>
            <View style={styles.wrapper}>
              <TextInput
                label="Style"
                mode="outlined"
                activeOutlineColor="black"
                outlineColor="grey"
                outlineStyle={styles.inputStyle}
                onChangeText={(val: string) => setArtistStyle(val)}
                value={artistStyle}
                keyboardType="default"
              />
            </View>
            <View style={styles.wrapper}>
              <TextInput
                label="Description"
                mode="outlined"
                activeOutlineColor="black"
                outlineColor="grey"
                outlineStyle={styles.inputStyle}
                onChangeText={(val: string) => setArtistDescription(val)}
                value={artistDescription}
                keyboardType="default"
                multiline={true}
              />
            </View>
            <Button
              onPress={async () => {
                await updateArtistHandler();
              }}
              mode="contained"
              buttonColor="black"
              textColor="white"
              style={styles.button}
            >
              Save Artist Profile
            </Button>
            <Button
              icon="trash-can-outline"
              onPress={async () => {
                await deletionHandler(artist!.id, 'artists');
              }}
              style={styles.button}
              mode="outlined"
              textColor="black"
            >
              Delete artist profile
            </Button>
          </View>
        ) : undefined}
      </ScrollView>
    </SafeAreaView>
  );
}

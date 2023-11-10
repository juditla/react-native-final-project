import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Switch, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { Artist, User } from '../../../types';
import UserContext from '../../UserProvider';
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

export default function EditProfile({ user, artist, setIsEditing }: Props) {
  const userContext = useContext(UserContext);
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
        router.push('/login'); //   go to login page? ist dann eh nicht mehr angemeldet?
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
    <View>
      <View>
        <Text>Edit your profile</Text>
        <TextInput
          label="First name"
          onChangeText={(val: string) => setFirstName(val)}
          value={firstName}
          keyboardType="default"
          autoComplete="given-name"
        />
        <TextInput
          label="Last name"
          onChangeText={(val: string) => setLastName(val)}
          value={lastName}
          keyboardType="default"
          autoComplete="given-name"
        />
        <View>
          <Text>Change Password?</Text>
          <Switch
            value={changePassword}
            onValueChange={() => setChangePassword(!changePassword)}
          />
        </View>
        {changePassword ? <ChangePassword user={user} /> : undefined}
        <Button
          onPress={async () => {
            await updateUserHandler();
          }}
        >
          Save
        </Button>
        <Button
          onPress={async () => {
            await deletionHandler(user.id, 'users');
          }}
        >
          Delete profile
        </Button>
      </View>
      {user.roleId === 1 ? (
        <View>
          <TextInput
            label="Artist name"
            onChangeText={(val: string) => setArtistName(val)}
            value={artistName}
            keyboardType="default"
          />
          <TextInput
            label="Style"
            onChangeText={(val: string) => setArtistStyle(val)}
            value={artistStyle}
            keyboardType="default"
          />
          <TextInput
            label="Descriptione"
            onChangeText={(val: string) => setArtistDescription(val)}
            value={artistDescription}
            keyboardType="default"
          />
          <Button
            onPress={async () => {
              await updateArtistHandler();
            }}
          >
            Save Artist Profile
          </Button>
          <Button
            onPress={async () => {
              await deletionHandler(artist?.id, 'artists');
            }}
          >
            Delete artist profile
          </Button>
        </View>
      ) : undefined}

      {errorMessage}
    </View>
  );
}

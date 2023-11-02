import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { z } from 'zod';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

type Props = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isEditing: boolean;
  setIsEditing: (boolean: boolean) => void;
};

const userToUpdateSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

export default function EditProfile({ user, isEditing, setIsEditing }: Props) {
  const userContext = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [errorMessage, setErrorMessage] = useState('');

  async function updateUserHandler() {
    console.log('user', user);
    const userToUpdate = {
      email: user.email,
      firstName,
      lastName,
    };
    console.log('usertoUpdate', userToUpdate);
    const validatedUserToUpdate = userToUpdateSchema.safeParse({
      firstName,
      lastName,
    });
    if (!validatedUserToUpdate.success) {
      setErrorMessage('First and last name must be at least 3 characters');
      console.log('hier gelandet');
    } else {
      console.log('user', user);
      console.log('toupdate', userToUpdate);
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

  return (
    <View>
      <Text>Edit your profile </Text>
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
      <Button
        onPress={async () => {
          await updateUserHandler();
        }}
      >
        Save
      </Button>
      {errorMessage}
    </View>
  );
}

import React, { useState } from 'react';
import { View } from 'react-native';
import { Message } from 'react-native-gifted-chat';
import { Button, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { User } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import { apiDomain } from '../studios';

type Props = {
  user: User;
  setChangePassword: (boolean: boolean) => void;
};

const passwordForm = z
  .object({
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
  });

export default function ChangePassword({ user, setChangePassword }: Props) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  async function changePasswordHandler() {
    // check if new password and confirm new password match
    try {
      const validatedPassword = passwordForm.safeParse({
        newPassword,
        confirmNewPassword,
      });
      console.log('validatedpassword', validatedPassword);
      if (validatedPassword.error) {
        return setErrorMessage(
          'New password and confirm new password must match and be at least 8 characters long',
        );
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Userid', user.id);
    // get token from session
    const token = await getSessionFromAsyncStorage();

    // send to backend and do further checks there (correct password, valid session,...)
    const passwordChangeResponse = await fetch(
      `${apiDomain}/users/changepassword/${user.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({
          token,
          oldPassword,
          newPassword,
          userId: user.id,
        }),
      },
    );
    const passwordChangeMessage = await passwordChangeResponse.json();

    setErrorMessage(passwordChangeMessage.message);
    if (passwordChangeResponse.ok) {
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }
  return (
    <View>
      <TextInput
        label="Old password"
        autoCapitalize="none"
        spellCheck={false}
        onChangeText={(val: string) => setOldPassword(val)}
        value={oldPassword}
        right={
          <TextInput.Icon
            onPress={() => setShowOldPassword(!showOldPassword)}
            icon={showOldPassword ? 'eye-off' : 'eye'}
          />
        }
        secureTextEntry={!showOldPassword}
        keyboardType="visible-password"
        autoComplete="password"
      />
      <TextInput
        label="New password"
        autoCapitalize="none"
        spellCheck={false}
        onChangeText={(val: string) => setNewPassword(val)}
        value={newPassword}
        right={
          <TextInput.Icon
            onPress={() => setShowNewPassword(!showNewPassword)}
            icon={showNewPassword ? 'eye-off' : 'eye'}
          />
        }
        secureTextEntry={!showNewPassword}
        keyboardType="visible-password"
        autoComplete="password"
      />
      <TextInput
        label="Confirm new password"
        autoCapitalize="none"
        spellCheck={false}
        onChangeText={(val: string) => setConfirmNewPassword(val)}
        value={confirmNewPassword}
        right={
          <TextInput.Icon
            onPress={() => setShowNewPassword(!showNewPassword)}
            icon={showNewPassword ? 'eye-off' : 'eye'}
          />
        }
        secureTextEntry={!showNewPassword}
        keyboardType="visible-password"
        autoComplete="password"
      />
      <Button onPress={() => changePasswordHandler()}>Change Password</Button>
      <Text>{errorMessage}</Text>
    </View>
  );
}

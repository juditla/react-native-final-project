import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { User } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import { apiDomain } from '../studios';

type Props = {
  user: User;
};

export default function ChangePassword({ user }: Props) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const passwordForm = z
    .object({
      newPassword: z.string().min(8),
      confirmNewPassword: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
    });

  async function changePasswordHandler() {
    // check if new password and confirm new password match
    try {
      passwordForm.safeParse({ newPassword, confirmNewPassword });
    } catch (err) {
      setErrorMessage("The two passwords don't match");
      console.log(err);
      return;
    }
    // get token
    const session = await getSessionFromAsyncStorage();
    // send to backend and do further checks there (correct password, valid session,...
    const passwordChangeResponse = await fetch(
      `${apiDomain}/users/changepassword/${user.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({
          token: session.token,
          oldPassword,
          newPassword,
          id: user.id,
        }),
      },
    );
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

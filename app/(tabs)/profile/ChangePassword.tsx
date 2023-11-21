import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { User } from '../../../types';
import { getSessionFromAsyncStorage } from '../../../util/session';
import { apiDomain } from '../studios';

type Props = {
  user: User;
};

const styles = StyleSheet.create({
  container: {
    //
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
});

const passwordForm = z
  .object({
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
  });

export default function ChangePassword({ user }: Props) {
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
      if (!validatedPassword.success) {
        return setErrorMessage(
          'New password and confirm new password must match and be at least 8 characters long',
        );
      }
    } catch (error) {
      console.log(error);
    }
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
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TextInput
          label="Old password"
          autoCapitalize="none"
          spellCheck={false}
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
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
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="New password"
          autoCapitalize="none"
          spellCheck={false}
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
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
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Confirm new password"
          autoCapitalize="none"
          spellCheck={false}
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
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
      </View>
      <Button
        onPress={() => changePasswordHandler()}
        mode="contained"
        buttonColor="black"
        textColor="white"
        style={styles.button}
      >
        Change Password
      </Button>
      <Text>{errorMessage}</Text>
    </View>
  );
}

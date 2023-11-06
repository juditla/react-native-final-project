import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { z } from 'zod';
import { apiDomain } from '../(tabs)/studios';
import { getSafeReturnToPath } from '../../util/validation';
import UserContext from '../UserProvider';

type Props = {
  returnTo?: string | string[];
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userContext = useContext(UserContext);

  async function handleLogin() {
    // input validation
    const validatedLogin = loginSchema.safeParse({ email, password });
    if (!validatedLogin.success) {
      setErrorMessage(
        "The input doesn't match the expected InputDeviceInfo. Email must be in a valid FormData, password must be at least 8 characters long",
      );
    } else {
      try {
        const response = await fetch(`${apiDomain}/login`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message);
        } else {
          try {
            await AsyncStorage.setItem(
              'session',
              JSON.stringify({
                sessionToken: data.token,
                expiresAt: data.expiresAt,
              }),
            );
            if (userContext) {
              userContext.updateUserForSession(data.token, () =>
                router.replace(`/artists`),
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }
  }
  return (
    <>
      <TextInput
        label="Email"
        onChangeText={(val) => setEmail(val)}
        value={email}
        // placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Text> </Text>
      <TextInput
        label="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        spellCheck={false}
        onChangeText={(val) => setPassword(val)}
        value={password}
        // placeholder=
        keyboardType="visible-password"
        autoComplete="password"
      />
      <Button
        onPress={async () => await handleLogin()}
        title="Login"
        color="#841584"
        accessibilityLabel="Login"
      />
      {/* <Text>{errorMessage}</Text> */}
      <Text>Don't have an account?</Text>
      <Link href="/registration" asChild>
        <Button title="Sign up" />
      </Link>
    </>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { getSafeReturnToPath } from '../../util/validation';
import { apiDomain } from '../studios';

type Props = {
  returnTo?: string | string[];
};

export default function LoginForm(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  async function handleLogin() {
    try {
      const response = await fetch(`${apiDomain}/login`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);

      router.push(getSafeReturnToPath(props.returnTo) || `/artists`);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
  return (
    <>
      <Text>Email:</Text>
      <TextInput
        onChangeText={(val) => setEmail(val)}
        value={email}
        // placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Text>Password:</Text>
      <TextInput
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
        onPress={async (event) => await handleLogin()}
        title="Login"
        color="#841584"
        accessibilityLabel="Login"
      />
    </>
  );
}

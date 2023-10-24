import { useRouter } from 'expo-router/src/hooks';
import { useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { apiDomain } from '../studios';

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  async function handleRegistration() {
    const response = await fetch(`${apiDomain}/users`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, firstName, lastName, password }),
    });

    const data = await response.json();

    if ('error' in data) {
      setErrors(data.error);
      return;
    }
    router.push(`/artists`);
    // we may have in the future revalidatePath()
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
      <Text>First name:</Text>
      <TextInput
        onChangeText={(val) => setFirstName(val)}
        value={firstName}
        // placeholder="First name"
        keyboardType="default"
        autoComplete="given-name"
      />
      <Text>Last name:</Text>
      <TextInput
        onChangeText={(val) => setLastName(val)}
        value={lastName}
        // placeholder="Last name"
        keyboardType="default"
        autoComplete="family-name"
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
      <Text>Confirm Password:</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        spellCheck={false}
        onChangeText={(val) => setConfirmPassword(val)}
        value={confirmPassword}
        // placeholder=
        keyboardType="visible-password"
        autoComplete="password"
      />
      <Button
        onPress={async () => await handleRegistration()}
        title="Register"
        color="#841584"
        accessibilityLabel="Register new user"
      />
      {errors.map((error) => {
        return <Text key={`error-${error}`}>{error}</Text>;
      })}
    </>
  );
}

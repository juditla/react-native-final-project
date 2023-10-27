import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router/src/hooks';
import { useState } from 'react';
import { Button, Switch, Text, TextInput } from 'react-native';
import { apiDomain } from '../studios';

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isArtist, setIsArtist] = useState(false);

  const toggleSwitch = () => setIsArtist((previousState) => !previousState);

  const router = useRouter();

  async function handleRegistration() {
    // create new user and send to database
    const newUser = {
      email,
      firstName,
      lastName,
      password,
      roleId: isArtist ? 1 : 2,
    };

    const response = await fetch(`${apiDomain}/users`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        // if user could be created --> login, create session in database and set token in async storage
        const loginResponse = await fetch(`${apiDomain}/login`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        const data = await loginResponse.json();

        try {
          await AsyncStorage.setItem(
            'session',
            JSON.stringify({
              sessionToken: data.token,
              expiresAt: data.expiresAt,
            }),
          );
          if (isArtist) {
            router.push(`/registration/artist`);
          } else {
            router.push(`/artists`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
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
      <Text>Do you want to register as an Artist?</Text>

      <Text> No</Text>
      <Switch onValueChange={toggleSwitch} value={isArtist} />
      <Text> Yes</Text>
      <Button
        onPress={async () => await handleRegistration()}
        title="Register"
        color="#841584"
        accessibilityLabel="Register new user"
      />
      <Text>{errorMessage}</Text>
    </>
  );
}

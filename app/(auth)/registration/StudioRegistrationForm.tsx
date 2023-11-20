import { useRouter } from 'expo-router/src/hooks';
import { useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { apiDomain } from '../../(tabs)/studios';
import { getSessionFromAsyncStorage } from '../../../util/session';

export default function ArtistRegistrationForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setpostalCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function handleStudioRegistration() {
    const token = await getSessionFromAsyncStorage();
    if (!token) {
      router.push('/login');
    }

    const newStudio = {
      name,
      address,
      city,
      postalCode,
    };

    const response = await fetch(`${apiDomain}/studios`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(newStudio),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        router.push(`/artists`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Text>Your studio's name:</Text>
      <TextInput
        onChangeText={(val) => setName(val)}
        value={name}
        // placeholder="Email"
        keyboardType="default"
      />
      <Text>Address:</Text>
      <TextInput
        onChangeText={(val) => setAddress(val)}
        value={address}
        // placeholder="First name"
        keyboardType="default"
      />
      <Text>Describe yourself</Text>
      <TextInput
        onChangeText={(val) => setpostalCode(val)}
        value={postalCode}
        // placeholder="Last name"
        keyboardType="number-pad"
        multiline={true}
      />
      <TextInput
        onChangeText={(val) => setCity(val)}
        value={city}
        // placeholder="Last name"
        keyboardType="default"
        multiline={true}
      />

      <Button
        onPress={async () => await handleStudioRegistration()}
        title="Register"
        color="#841584"
        accessibilityLabel="Create Artist"
      />
      <Text>{errorMessage}</Text>
    </>
  );
}

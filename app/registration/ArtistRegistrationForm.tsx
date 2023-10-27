import { useRouter } from 'expo-router/src/hooks';
import { useState } from 'react';
import { Button, Switch, Text, TextInput } from 'react-native';
import { z } from 'zod';
import { getSessionFromAsyncStorage } from '../../util/session';
import { apiDomain } from '../studios';

const artistRegistrationSchema = z.object({
  name: z.string().min(3),
  style: z.string().min(3),
  description: z.string().min(10),
});

export default function ArtistRegistrationForm() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function handleArtistRegistration() {
    // check if there is a valid session,
    const token = await getSessionFromAsyncStorage();
    if (!token) {
      console.log('no token', token);
      router.push('/login');
    }

    const newArtist = {
      name,
      style,
      description,
      token,
    };
    const validatedNewArtist = artistRegistrationSchema.safeParse({
      name,
      style,
      description,
    });
    if (!validatedNewArtist.success) {
      setErrorMessage(
        'Name & style must be at least 3 characters, your description should be  a minimum of 10 characters',
      );
    } else {
      const response = await fetch(`${apiDomain}/artists`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(newArtist),
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
  }
  return (
    <>
      <Text>Your artist name:</Text>
      <TextInput
        onChangeText={(val) => setName(val)}
        value={name}
        // placeholder="Email"
        keyboardType="default"
      />
      <Text>Your style:</Text>
      <TextInput
        onChangeText={(val) => setStyle(val)}
        value={style}
        // placeholder="First name"
        keyboardType="default"
      />
      <Text>Describe yourself</Text>
      <TextInput
        onChangeText={(val) => setDescription(val)}
        value={description}
        // placeholder="Last name"
        keyboardType="default"
        multiline={true}
      />

      <Button
        onPress={async () => await handleArtistRegistration()}
        title="Register"
        color="#841584"
        accessibilityLabel="Create Artist"
      />
      <Text>{errorMessage}</Text>
    </>
  );
}

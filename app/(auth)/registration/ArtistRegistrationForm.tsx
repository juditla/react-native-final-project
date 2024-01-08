import { useRouter } from 'expo-router/src/hooks';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { apiDomain } from '../../(tabs)/studios';
import { getSessionFromAsyncStorage } from '../../../util/session';
import UserContext from '../../UserProvider';

const artistRegistrationSchema = z.object({
  name: z.string().min(3),
  style: z.string().min(3),
  description: z.string().min(10),
});

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  wrapper: {
    marginTop: 10,
  },
  button: {
    marginTop: 25,
    borderRadius: 15,
  },
  loginWrapper: {
    marginTop: 10,
  },
  inputStyle: {
    borderRadius: 15,
  },
  artistRegistration: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});

export default function ArtistRegistrationForm() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userContext = useContext(UserContext);

  const router = useRouter();

  async function handleArtistRegistration() {
    // check if there is a valid session,
    const token = await getSessionFromAsyncStorage();
    if (!token) {
      router.push('/login');
    }

    const newArtist = {
      name,
      style,
      description,
      token,
      userId: userContext?.currentUser?.id,
    };
    const validatedNewArtist = artistRegistrationSchema.safeParse({
      name,
      style,
      description,
    });
    if (!validatedNewArtist.success && validatedNewArtist.error.issues[0]) {
      setErrorMessage(
        `${validatedNewArtist.error.issues[0].path[0]}: ${validatedNewArtist.error.issues[0].message}`,
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
          if (userContext) {
            userContext.updateUserForSession(token, () =>
              router.push(`/profile`),
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text variant="displayMedium">Artist account</Text>
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Your artist name"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          onChangeText={(val: string) => setName(val)}
          value={name}
          keyboardType="default"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Your style"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          onChangeText={(val: string) => setStyle(val)}
          value={style}
          keyboardType="default"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="About yourself"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          numberOfLines={4}
          onChangeText={(val: string) => setDescription(val)}
          value={description}
          keyboardType="default"
          multiline={true}
        />
      </View>

      <Button
        onPress={async () => await handleArtistRegistration()}
        accessibilityLabel="Create Artist"
        mode="contained"
        buttonColor="black"
        textColor="white"
        style={styles.button}
      >
        Register
      </Button>
      <HelperText style={styles.centerText} type="error">
        {errorMessage}
      </HelperText>
    </View>
  );
}

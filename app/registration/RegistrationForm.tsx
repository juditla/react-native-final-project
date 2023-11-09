import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router/src/hooks';
import { useContext, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { Switch, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { apiDomain } from '../(tabs)/studios';
import UserContext from '../UserProvider';

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  roleId: z.number(),
});

const passwordForm = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isArtist, setIsArtist] = useState(false);
  const userContext = useContext(UserContext);

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

    // INPUT VALIDATION
    // check if password & confirm password are the same
    try {
      passwordForm.safeParse({ password, confirmPassword });
      console.log('validation passed');
    } catch (err) {
      setErrorMessage("The two passwords don't match");
      console.log(err);
      return;
    }
    // check if user input is correct & only create user with correct input
    const validatedNewUser = registrationSchema.safeParse(newUser);
    if (!validatedNewUser.success) {
      console.log(validatedNewUser.error);
      setErrorMessage(
        'Please check your input: is your email in the right format? Is your password at least 8 characters long?',
      );
    } else {
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
            console.log(userContext);
            if (userContext) {
              userContext.updateUserForSession(data.token, () => {
                if (isArtist) {
                  router.push(`/registration/artist`);
                } else {
                  router.push(`/artists`);
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <>
      <Text>Email:</Text>
      <TextInput
        label="Email"
        onChangeText={(val: string) => setEmail(val)}
        value={email}
        // placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Text>First name:</Text>
      <TextInput
        label="First name"
        onChangeText={(val: string) => setFirstName(val)}
        value={firstName}
        // placeholder="First name"
        keyboardType="default"
        autoComplete="given-name"
      />
      <Text>Last name:</Text>
      <TextInput
        label="Last name"
        onChangeText={(val: string) => setLastName(val)}
        value={lastName}
        // placeholder="Last name"
        keyboardType="default"
        autoComplete="family-name"
      />
      <Text>Password:</Text>
      <TextInput
        label="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        spellCheck={false}
        onChangeText={(val: string) => setPassword(val)}
        value={password}
        // placeholder=
        keyboardType="visible-password"
        autoComplete="password"
      />
      <Text>Confirm Password:</Text>
      <TextInput
        label="Confirm password"
        autoCapitalize="none"
        secureTextEntry={true}
        spellCheck={false}
        onChangeText={(val: string) => setConfirmPassword(val)}
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
      <View>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text> Log in</Text>
        </TouchableOpacity>
      </View>
      <Text>{errorMessage}</Text>
    </>
  );
}

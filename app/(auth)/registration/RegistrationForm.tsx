import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router/src/hooks';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { z } from 'zod';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';

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

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  wrapper: {
    marginTop: 10,
  },
  headerWrapper: {
    marginTop: 10,
    width: 270,
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
  highlightText: {
    fontFamily: 'MontserratAlternates_600SemiBold',
  },
  centerText: { textAlign: 'center' },
  helperText: { textAlign: 'center', fontSize: 18, marginTop: 20 },
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
  const [showPassword, setShowPassword] = useState(false);

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
    const validatedPassword = passwordForm.safeParse({
      password,
      confirmPassword,
    });
    if (!validatedPassword.success && validatedPassword.error.issues[0]) {
      setErrorMessage(validatedPassword.error.issues[0].message);
      return;
    }
    // check if user input is correct & only create user with correct input
    const validatedNewUser = registrationSchema.safeParse(newUser);
    if (!validatedNewUser.success && validatedNewUser.error.issues[0]) {
      setErrorMessage(validatedNewUser.error.issues[0].message);
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

          const loginData = await loginResponse.json();
          try {
            await AsyncStorage.setItem(
              'session',
              JSON.stringify({
                sessionToken: loginData.token,
                expiresAt: loginData.expiresAt,
              }),
            );

            if (userContext) {
              console.log('are we getting here?');
              userContext.updateUserForSession(loginData.token, () => {
                router.push(`/registration/profilePicture`);
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
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text variant="headlineMedium" style={styles.highlightText}>
          Create account
        </Text>
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Email"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          onChangeText={(val: string) => setEmail(val)}
          value={email}
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="First name"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          onChangeText={(val: string) => setFirstName(val)}
          value={firstName}
          keyboardType="default"
          autoComplete="given-name"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Last name"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          onChangeText={(val: string) => setLastName(val)}
          value={lastName}
          keyboardType="default"
          autoComplete="family-name"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Password"
          autoCapitalize="none"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          spellCheck={false}
          onChangeText={(val: string) => setPassword(val)}
          value={password}
          right={
            <TextInput.Icon
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? 'eye-off' : 'eye'}
            />
          }
          secureTextEntry={!showPassword}
          keyboardType="visible-password"
          autoComplete="password"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Confirm password"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          autoCapitalize="none"
          spellCheck={false}
          onChangeText={(val: string) => setConfirmPassword(val)}
          value={confirmPassword}
          right={
            <TextInput.Icon
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? 'eye-off' : 'eye'}
            />
          }
          secureTextEntry={!showPassword}
          keyboardType="visible-password"
          autoComplete="password"
        />
      </View>
      <View style={styles.artistRegistration}>
        <Text>Register as a tattoo artist?</Text>
        <Switch
          value={isArtist}
          onValueChange={() => setIsArtist(!isArtist)}
          color="black"
        />
      </View>
      <Button
        onPress={async () => await handleRegistration()}
        style={styles.button}
        mode="contained"
        buttonColor="black"
        textColor="white"
        accessibilityLabel="Register new user"
      >
        Register
      </Button>
      <View style={styles.loginWrapper}>
        <Text style={styles.centerText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <Button mode="text" textColor="black">
            Log in
          </Button>
        </Link>
      </View>
      <HelperText style={styles.helperText} type="error">
        {errorMessage}
      </HelperText>
    </View>
  );
}

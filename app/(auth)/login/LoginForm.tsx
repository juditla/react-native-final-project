import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    borderRadius: 15,
  },
  registrationWrapper: {
    marginTop: 10,
  },
  inputStyle: {
    borderRadius: 15,
  },
});

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const userContext = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    // input validation
    const validatedLogin = loginSchema.safeParse({ email, password });
    if (!validatedLogin.success) {
      setErrorMessage('E-Mail or password invalid');
      setIsError(true);
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
          setIsError(true);
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
    <View>
      <View style={styles.wrapper}>
        <Text variant="displayMedium">Welcome to</Text>
        <Text variant="displayLarge">Inkspire</Text>
        <Text variant="headlineSmall">find your local tattoo artist</Text>
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Email"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          error={isError ? true : false}
          onChangeText={(val) => setEmail(val)}
          value={email}
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>
      <View style={styles.wrapper}>
        <TextInput
          label="Password"
          mode="outlined"
          activeOutlineColor="black"
          outlineColor="grey"
          outlineStyle={styles.inputStyle}
          error={isError ? true : false}
          spellCheck={false}
          right={
            <TextInput.Icon
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? 'eye-off' : 'eye'}
            />
          }
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(val) => setPassword(val)}
          autoCapitalize="none"
          autoComplete="password"
        />
        <HelperText type="error" visible={isError ? true : false}>
          {errorMessage}
        </HelperText>
      </View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={async () => await handleLogin()}
        accessibilityLabel="Login"
        buttonColor="black"
        textColor="white"
      >
        Login
      </Button>
      <View style={styles.registrationWrapper}>
        <Text style={{ textAlign: 'center' }}>Don't have an account?</Text>
        <Link href="/registration" asChild>
          <Button mode="text" textColor="black">
            Sign up
          </Button>
        </Link>
      </View>
    </View>
  );
}

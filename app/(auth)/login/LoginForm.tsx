import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { z } from 'zod';
import { apiDomain } from '../../(tabs)/studios';
import UserContext from '../../UserProvider';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userContext = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

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
      <View style={styles.container}>
        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Login</Text>
        </View>
        <View style={styles.text2}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/registration')}>
            <Text style={styles.signupText}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        label="Email"
        onChangeText={(val) => setEmail(val)}
        value={email}
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        spellCheck={false}
        label="Password"
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
      <Button
        onPress={async () => await handleLogin()}
        title="Login"
        accessibilityLabel="Login"
      />
      <Text>{errorMessage}</Text>
      <Text>Don't have an account?</Text>
      <Link href="/registration" asChild>
        <Button title="Sign up" />
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LoginText: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: 'bold',
  },
  Middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
  signupText: {
    fontWeight: 'bold',
  },
  emailField: {
    marginTop: 30,
    marginLeft: 15,
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5,
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonDesign: {
    backgroundColor: '#026efd',
  },
  lineStyle: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
    marginLeft: 20,
  },
  boxStyle: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-around',
  },
});

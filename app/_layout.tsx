import { Stack, Tabs } from 'expo-router';
import { UserProvider } from './UserProvider';

export default function Layout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: 'grey',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}

import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function index() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'second pups',
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTintColor: 'pink',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Text>This is your artists page</Text>
    </View>
  );
}

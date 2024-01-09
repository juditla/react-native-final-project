import { router, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function stackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '',
          headerTintColor: 'black',
          headerLeft: () => {
            return (
              <Icon.Button
                name="color-palette"
                size={30}
                color="black"
                backgroundColor="transparent"
                onPress={() => router.replace('/artists')}
                underlayColor="transparent"
                activeOpacity={0.5}
              >
                Go back to artists
              </Icon.Button>
            );
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerBackTitleVisible: false,
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}

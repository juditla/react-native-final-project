import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

type IconBoolean = {
  focused: boolean;
};

const TabIconArtists = ({ focused }: IconBoolean) => (
  <Icon name={focused ? 'color-palette' : 'color-palette-outline'} size={30} />
);
const TabIconAStudios = ({ focused }: IconBoolean) => (
  <Icon name={focused ? 'home' : 'home-outline'} size={30} />
);

const TabIconMessages = ({ focused }: IconBoolean) => (
  <Icon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={30} />
);

const TabIconProfile = ({ focused }: IconBoolean) => (
  <Icon name={focused ? 'person-circle' : 'person-circle-outline'} size={30} />
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="artists"
      screenOptions={{
        tabBarLabel: 'Artists',
        tabBarActiveTintColor: 'black',
      }}
    >
      <Tabs.Screen
        name="artists"
        options={{
          tabBarLabel: 'Artists',
          tabBarIcon: TabIconArtists,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="studios"
        options={{
          tabBarLabel: 'Studios',
          tabBarIcon: TabIconAStudios,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: TabIconMessages,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: TabIconProfile,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

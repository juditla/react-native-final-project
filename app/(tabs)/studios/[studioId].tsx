import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Studio } from '../../../types';
import { apiDomain } from './';

type Props = {
  params: {
    id: number;
    // artistId: number
  };
};

export default function SingleStudio({ params }: Props) {
  // const { studioId } = useLocalSearchParams();
  const studioId = params.id;

  const [studio, setStudio] = React.useState<Studio>();

  const getStudioById = async () => {
    try {
      const response = await fetch(`${apiDomain}/studios/${studioId}`);
      const json = await response.json();
      setStudio(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getStudioById()
      .then()
      .catch((error) => error);
  }, []);

  if (studio) {
    return (
      <View>
        <Text>Hi this is Studio</Text>
        <Text>{studio.name}</Text>
        <Text>{studio.address}</Text>
        <Text>
          {studio.postalCode} {studio.city}
        </Text>
      </View>
    );
  } else {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View>
          <Text>Sorry we could not find that tattoo studio...</Text>
        </View>
      </>
    );
  }
}

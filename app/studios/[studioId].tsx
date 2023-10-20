import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Studio } from '../../types';

// import { apiDomain } from './';

export default function SingleStudio() {
  const { studioId } = useLocalSearchParams();

  const [studio, setStudio] = React.useState<Studio>();

  const getStudioById = async () => {
    try {
      const response = await fetch('http://localhost:4000/studios/' + studioId);
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
    console.log(studio);
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
      <View>
        <Text>Sorry we could not find that tattoo studio...</Text>
      </View>
    );
  }
}

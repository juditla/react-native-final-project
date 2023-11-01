import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function stackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

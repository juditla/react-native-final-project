import React from 'react';
import { Text, View } from 'react-native';
import { Artist } from '../../../types';

type Props = {
  user: Artist;
};
export default function EditProfile() {
  return (
    <View>
      <Text>EditProfile</Text>
      {/* <Button onPress={() => setIsEditing(trfalseue)}> */}
    </View>
  );
}

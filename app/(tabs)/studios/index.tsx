import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Studio } from '../../../types';
import StudioItem from '../studios/StudioItem';

export const apiDomain = 'http://localhost:4000';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  rowContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
});

const renderItem = (item: { item: Studio }) => (
  <StudioItem studio={item.item} />
);

export default function Index() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const bottomTabHeight = useBottomTabBarHeight();

  const getStudios = async () => {
    try {
      const response = await fetch(apiDomain + '/studios');
      const json = await response.json();
      setStudios(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudios()
      .then()
      .catch((error) => error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.rowContainer}>
        <Text variant="headlineMedium" style={styles.highlightFont}>
          Studios
        </Text>
        <Icon source="filter-variant" size={25} />
      </View>
      <FlatList
        data={studios}
        renderItem={renderItem}
        keyExtractor={(studio: Studio) => studio.id.toString()}
        contentContainerStyle={{ paddingBottom: bottomTabHeight }}
      />
    </SafeAreaView>
  );
}

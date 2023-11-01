import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Studio } from '../../../types';
import StudioItem from '../../old/studios/StudioItem';

export const apiDomain = 'http://localhost:4000';

const renderItem = (item: { item: Studio }) => (
  <StudioItem studio={item.item} />
);

export default function Index() {
  const [studios, setStudios] = useState<Studio[]>([]);

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
    <FlatList
      data={studios}
      renderItem={renderItem}
      keyExtractor={(studio: Studio) => studio.id.toString()}
    />
  );
}

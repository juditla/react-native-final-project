import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Studio } from '../../types';
import StudioItem from './StudioItem';

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

  // const studioList = studios.map((studio) => {
  //   return (
  //     <View style={styles.container} key={`studio-${studio.id}`}>
  //       <Text>{studio.name}</Text>
  //       <Link
  //         href={{
  //           pathname: `/studios/${studio.id}`,
  //           params: { id: studio.id },
  //         }}
  //       >
  //         Go to studio
  //       </Link>
  //     </View>
  //   );
  // });

  useEffect(() => {
    getStudios()
      .then()
      .catch((error) => error);
  }, []);

  return (
    <>
      <View>
        <Text>Studios</Text>
      </View>
      <FlatList
        data={studios}
        renderItem={renderItem}
        keyExtractor={(studio: Studio) => studio.id.toString()}
      />
    </>
  );
}

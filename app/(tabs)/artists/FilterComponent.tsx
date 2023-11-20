import React, { useState } from 'react';
import { Button, Modal, PaperProvider, Portal, Text } from 'react-native-paper';

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  height: 300,
  position: 'absolute',
  top: 0,
  width: 300,
  // margin: 20,
  // zIndex: 3,
};

export default function FilterComponent() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <PaperProvider>
      <Portal>
        <Modal visible={isModalVisible} contentContainerStyle={containerStyle}>
          <Text>Example Modal.</Text>
          <Button mode="outlined" onPress={() => setIsModalVisible(false)}>
            Close
          </Button>
        </Modal>
      </Portal>
      <Button onPress={() => setIsModalVisible(true)}>Show</Button>
    </PaperProvider>
  );
}

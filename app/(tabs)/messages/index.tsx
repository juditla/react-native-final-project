import { router, useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

type Conversation = {
  id: number;
  ownerId: number;
  participantId: number;
  createDate: string;
  owner: {
    id: number;
    firstName: string;
  };
  participant: {
    id: number;
    firstName: string;
  };
};

const styles = StyleSheet.create({
  conversationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // marginLeft: 5,
    // marginRight: 5,
    padding: 15,
    alignItems: 'center',
    // borderWidth: 1,
    borderColor: 'grey',
    // marginTop: 10,
    // borderRadius: 10,
    borderBottomWidth: 2,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // margin: 20,
  },
  wrapper: {
    marginBottom: 15,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default function Index() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const userContext = useContext(UserContext);

  const getConversations = async () => {
    try {
      const response = await fetch(
        `${apiDomain}/conversations/${userContext?.currentUser?.id}`,
      );
      const json = await response.json();
      setConversations(json);
    } catch (error) {
      console.error(error);
    }
  };
  if (!userContext?.currentUser?.id) {
    router.replace('/login');
  }

  useEffect(() => {
    getConversations()
      .then()
      .catch((error) => error);
  }, [userContext]);

  useFocusEffect(
    useCallback(() => {
      getConversations()
        .then()
        .catch((error) => error);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text variant="headlineMedium">Messages</Text>
      </View>
      {conversations.length > 0 ? (
        conversations.map((item) => {
          const conversationPartner =
            item.owner.id === userContext?.currentUser.id &&
            item.participant.id === userContext.currentUser.id
              ? `${item.owner.firstName} - Yourself`
              : item.owner.id === userContext?.currentUser.id
              ? item.participant.firstName
              : item.owner.firstName;
          return (
            // <View style={styles.conversationContainer} key={`key-${item.id}`}>
            <TouchableOpacity
              style={styles.conversationContainer}
              key={`key-${item.id}`}
              onPress={() =>
                router.push({
                  pathname: `messages/${item.id}`,
                  params: { conversationId: item.id, conversationPartner },
                })
              }
            >
              <Text variant="titleMedium">{conversationPartner}</Text>
              <Text variant="titleMedium">{'>'}</Text>
            </TouchableOpacity>
            // </View>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="sad-outline" size={30} />
          <Text>You have no conversations yet...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

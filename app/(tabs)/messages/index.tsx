import { Link, router, useFocusEffect } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
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
    // display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    alignItems: 'center',
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

  // useFocusEffect(() => {
  //   getConversations()
  //     .then()
  //     .catch((error) => error);
  // });

  return (
    <View>
      {conversations
        ? conversations.map((item) => {
            const conversationPartner =
              item.owner.id === userContext?.currentUser.id
                ? item.participant.firstName
                : item.owner.firstName;
            return (
              <View style={styles.conversationContainer} key={`key-${item.id}`}>
                <Text>{conversationPartner}</Text>
                <Link
                  href={{
                    pathname: `messages/${item.id}`,
                    params: { conversationId: item.id, conversationPartner },
                  }}
                  asChild
                >
                  <Button>{'>'}</Button>
                </Link>
              </View>
            );
          })
        : undefined}
    </View>
  );
}

import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertDate } from '../../../util/convertDate';
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
    avatar: string;
  };
  participant: {
    id: number;
    firstName: string;
    avatar: string;
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
    // borderBottomWidth: 2,
    // backgroundColor: 'white',
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
      <ScrollView>
        {conversations.length > 0 ? (
          conversations.map((item) => {
            console.log('item:', item);
            console.log('item.message', item.message[0]);
            const conversationPartner =
              item.owner.id === userContext?.currentUser.id
                ? // &&
                  // item.participant.id === userContext.currentUser.id
                  // ? `${item.owner.firstName} - Yourself`
                  // : item.owner.id === userContext?.currentUser.id
                  item.participant
                : item.owner;
            return (
              // <View style={styles.conversationContainer} key={`key-${item.id}`}>
              <TouchableOpacity
                style={styles.conversationContainer}
                key={`key-${item.id}`}
                onPress={() =>
                  router.push({
                    pathname: `messages/${item.id}`,
                    params: {
                      conversationId: item.id,
                      conversationPartner: conversationPartner.firstName,
                    },
                  })
                }
              >
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{
                      uri: conversationPartner.avatar
                        ? conversationPartner.avatar
                        : 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
                    }}
                    style={{ height: 50, width: 50, borderRadius: 60 }}
                  />
                  <View>
                    <Text variant="titleMedium">
                      {conversationPartner.firstName}
                    </Text>
                    <Text variant="titleSmall" style={{ color: 'grey' }}>
                      {item.message[0] ? item.message[0].text : ''}
                    </Text>
                  </View>
                </View>
                <Text variant="titleSmall" style={{ color: 'grey' }}>
                  {item.message[0]
                    ? convertDate(item.message[0].createDate)
                    : ''}
                </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

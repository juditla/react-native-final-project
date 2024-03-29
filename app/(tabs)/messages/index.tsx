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
import { Message } from './[conversationId]';

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
  message: [Message];
};

const styles = StyleSheet.create({
  conversationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderColor: 'grey',
  },
  emptyContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  wrapper: {
    marginBottom: 15,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  highlightFont: { fontFamily: 'MontserratAlternates_600SemiBold' },
  greyText: { color: 'grey' },
  imageContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  imageStyle: { height: 50, width: 50, borderRadius: 60 },
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
        <Text variant="headlineMedium" style={styles.highlightFont}>
          Messages
        </Text>
      </View>
      <ScrollView>
        {conversations.length > 0 ? (
          conversations.map((item) => {
            const conversationPartner =
              item.owner.id === userContext!.currentUser!.id
                ? item.participant
                : item.owner;
            return (
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
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: conversationPartner.avatar
                        ? conversationPartner.avatar
                        : 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
                    }}
                    style={styles.imageStyle}
                  />
                  <View>
                    <Text variant="titleMedium">
                      {conversationPartner.firstName}
                    </Text>
                    <Text variant="titleSmall" style={styles.greyText}>
                      {item.message[0].text ? item.message[0].text : undefined}
                    </Text>
                  </View>
                </View>
                <Text variant="titleSmall" style={styles.greyText}>
                  {item.message[0].createDate
                    ? convertDate(item.message[0].createDate)
                    : undefined}
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

import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { User } from '../../../types';
import modifyMessage from '../../../util/modifyMessage';
import sortArrayByDate from '../../../util/sortArrayByDate';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

export type Message = {
  id: number;
  senderId: number;
  coinversationtId: number;
  createDate: string;
  text: string;
  sender: User;
};

type GiftedChatMessage = [
  {
    _id: string;
    createdAt: Date;
    text: string;
    user: {
      _id: number;
    };
  },
];

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    // flexDirection: 'column-reverse',
  },
});

function modifyAndSortMessagesArray(array: Message[]): MessageForGiftedChat[] {
  const modifiedMessageArray = array.map((message) => {
    console.log(message);
    return modifyMessage(message);
  });
  console.log(modifiedMessageArray);
  return sortArrayByDate(modifiedMessageArray);
}

export default function SingleConversation() {
  const { conversationId, conversationPartner } = useLocalSearchParams();
  const [messages, setMessages] = useState<MessageForGiftedChat[] | []>([]);
  const userContext = useContext(UserContext);

  async function sendMessageHandler(newMessageArray: GiftedChatMessage) {
    try {
      const messageResponse = await fetch(`${apiDomain}/messages`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          text: newMessageArray[0].text,
          senderId: userContext?.currentUser?.id,
          conversationId: Number(conversationId),
        }),
      });
      const returnedMessage = await messageResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  const getMessagesByConversationId = async () => {
    try {
      const response = await fetch(`${apiDomain}/messages/${conversationId}`);
      const json = await response.json();
      const modifiedMessagesforGiftedChat = modifyAndSortMessagesArray(json);
      setMessages(modifiedMessagesforGiftedChat);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMessagesByConversationId()
      .then(() => console.log('there', messages))
      .catch((error) => error);
  }, [conversationId]);

  const onSend = useCallback(async (message = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message),
    );
    await sendMessageHandler(message);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getMessagesByConversationId()
        .then()
        .catch((error) => error);
    }, []),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: conversationPartner ? conversationPartner : '',
          headerTintColor: 'black',
          //   headerShown: false,
        }}
      />

      <GiftedChat
        messagesContainerStyle={styles.chatContainer}
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: userContext?.currentUser?.id,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: 'white',
                },
                left: {
                  color: 'white',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#05C19C',
                },
                right: {
                  backgroundColor: '#474554',
                },
              }}
            />
          );
        }}
      />
    </>
  );
}

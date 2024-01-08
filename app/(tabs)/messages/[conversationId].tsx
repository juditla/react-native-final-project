import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Bubble, GiftedChat, IMessage, Time } from 'react-native-gifted-chat';
import { User } from '../../../types';
import modifyMessage from '../../../util/modifyMessage';
import sortArrayByDate from '../../../util/sortArrayByDate';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

export type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  createDate: string;
  text: string;
  sender: User;
};

type SearchParams = {
  conversationId: string;
  conversationPartner: string;
};

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
  },
});

function modifyAndSortMessagesArray(array: Message[]): IMessage[] {
  const modifiedMessageArray = array.map((message) => {
    return modifyMessage(message);
  });
  return sortArrayByDate(modifiedMessageArray);
}

export default function SingleConversation() {
  const { conversationId, conversationPartner } =
    useLocalSearchParams<SearchParams>();
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const userContext = useContext(UserContext);

  async function sendMessageHandler(newMessageArray: IMessage[]) {
    try {
      if (!newMessageArray[0]) {
        throw new Error('Ups should not happen, but no message');
      }
      await fetch(`${apiDomain}/messages`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          text: newMessageArray[0].text,
          senderId: userContext?.currentUser?.id,
          conversationId: Number(conversationId),
        }),
      });
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
    getMessagesByConversationId().catch((error) => error);
  }, [conversationId]);

  const onSend = useCallback(async (message: IMessage[]) => {
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
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerBackTitleVisible: false,
        }}
      />
      <GiftedChat
        messagesContainerStyle={styles.chatContainer}
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: userContext!.currentUser!.id,
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
        renderTime={(props) => {
          return (
            <Time
              {...props}
              timeTextStyle={{
                left: {
                  color: 'white',
                },
                right: {
                  color: 'white',
                },
              }}
            />
          );
        }}
      />
    </>
  );
}

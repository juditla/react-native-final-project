import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button, TextInput } from 'react-native-paper';
import { User } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

type Message = {
  id: number;
  senderId: number;
  coinversationtId: number;
  createDate: string;
  text: string;
  sender: User;
};

type MessageForGiftedChat = Message & {
  createdAt: string;
  _id: number;
  user: User;
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
  const modifiedArray = array.map((message) => {
    return modifyMessage(message);
  });
  const sortedArray = modifiedArray.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return sortedArray;
}

function modifyMessage(message: Message): MessageForGiftedChat {
  const modifiedMessage = message;
  modifiedMessage.createdAt = message.createDate;
  console.log('datenbankdate', message.createDate);
  modifiedMessage._id = message.id;
  modifiedMessage.user = {
    _id: message.senderId,
    name: message.sender.firstName,
    avatar: '',
  };
  return modifiedMessage;
}

export default function SingleConversation() {
  const { conversationId, conversationPartner } = useLocalSearchParams();
  const [messages, setMessages] = useState<MessageForGiftedChat[] | []>([]);
  const [newMessage, setNewMessage] = useState('');
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

  useEffect(() => {
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

    getMessagesByConversationId()
      .then(() => console.log('there', messages))
      .catch((error) => error);
  }, [conversationId]);

  const onSend = useCallback(async (message = []) => {
    console.log('giftedchatdate', message[0].createdAt);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message),
    );
    await sendMessageHandler(message);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: conversationPartner ? conversationPartner : '',
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
      />
    </>

    // <>
    //   <View>
    //     <Text>This is your conversation</Text>
    //     {messages.map((message) => {
    //       message.createdAt = message.createDate;
    //       message._id = message.id;
    //       message.user = {
    //         _id: message.sender.id,
    //         name: message.sender.firstName,
    //         avatar: '',
    //       };
    //       return (
    //         <Text key={`id-${message.id}`}>
    //           {message.user.name}:{message.text}
    //         </Text>
    //       );
    //     })}
    //   </View>
    //   <View>
    //     <TextInput
    //       value={newMessage}
    //       onChangeText={(val) => setNewMessage(val)}
    //     />
    //     <Button onPress={async () => await sendMessageHandler()}>Send</Button>
    //   </View>
    // </>
  );
}

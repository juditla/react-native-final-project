import { IMessage } from 'react-native-gifted-chat';
import { Message } from '../app/(tabs)/messages/[conversationId]';

export default function modifyMessage(message: Message): IMessage {
  const modifiedMessage = {
    ...message,
    createdAt: new Date(message.createDate),
    _id: message.id,
    user: {
      _id: message.senderId,
      name: message.sender.firstName,
      avatar: '',
    },
  };
  return modifiedMessage;
}

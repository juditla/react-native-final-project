import { IMessage } from 'react-native-gifted-chat';
import { Message } from '../app/(tabs)/messages/[conversationId]';
import { User } from '../types';

// type MessageForGiftedChat = Message & {
//   createdAt: string;
//   _id: number;
//   user: User;
// };

export default function modifyMessage(message: Message): IMessage {
  const modifiedMessage = message;
  modifiedMessage.createdAt = message.createDate;
  modifiedMessage._id = message.id;
  modifiedMessage.user = {
    _id: message.senderId,
    name: message.sender.firstName,
    avatar: '',
  };
  return modifiedMessage;
}

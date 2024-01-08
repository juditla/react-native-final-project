import { IMessage } from 'react-native-gifted-chat';

export default function sortArrayByDate(unsortedArray: IMessage[]) {
  const sortedArray = unsortedArray.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return sortedArray;
}

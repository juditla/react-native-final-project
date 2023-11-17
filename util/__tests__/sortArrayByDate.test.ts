import { expect, test } from '@jest/globals';
import sortArrayByDate from '../sortArrayByDate';

const unsortedMessageArray = [
  {
    _id: 2,
    conversationId: 5,
    createDate: '2024-01-01T14:00:00.000Z',
    createdAt: '2024-01-01T14:00:00.000Z',
    id: 2,
    sender: {
      email: 'maria@test.de',
    },
    senderId: 9,
    text: 'mariamariamaria',
    user: { _id: 9, avatar: '', name: 'maria' },
  },
  {
    _id: 1,
    conversationId: 2,
    createDate: '2023-11-14T14:38:40.940Z',
    createdAt: '2023-11-14T14:38:40.940Z',
    id: 1,
    sender: {
      email: 'test@test.de',
    },
    senderId: 5,
    text: 'testtesttest',
    user: { _id: 5, avatar: '', name: 'test' },
  },
  {
    _id: 3,
    conversationId: 2,
    createDate: '2023-12-14T14:38:40.940Z',
    createdAt: '2023-12-14T14:38:40.940Z',
    id: 3,
    sender: {
      email: 'lalala@test.de',
    },
    senderId: 4,
    text: 'lalalalalalalalala',
    user: { _id: 4, avatar: '', name: 'lalala' },
  },
];

const sortedMessageArray = [
  {
    _id: 2,
    conversationId: 5,
    createDate: '2024-01-01T14:00:00.000Z',
    createdAt: '2024-01-01T14:00:00.000Z',
    id: 2,
    sender: {
      email: 'maria@test.de',
    },
    senderId: 9,
    text: 'mariamariamaria',
    user: { _id: 9, avatar: '', name: 'maria' },
  },
  {
    _id: 3,
    conversationId: 2,
    createDate: '2023-12-14T14:38:40.940Z',
    createdAt: '2023-12-14T14:38:40.940Z',
    id: 3,
    sender: {
      email: 'lalala@test.de',
    },
    senderId: 4,
    text: 'lalalalalalalalala',
    user: { _id: 4, avatar: '', name: 'lalala' },
  },
  {
    _id: 1,
    conversationId: 2,
    createDate: '2023-11-14T14:38:40.940Z',
    createdAt: '2023-11-14T14:38:40.940Z',
    id: 1,
    sender: {
      email: 'test@test.de',
    },
    senderId: 5,
    text: 'testtesttest',
    user: { _id: 5, avatar: '', name: 'test' },
  },
];

test('sorts array by date ', () => {
  expect(sortArrayByDate(unsortedMessageArray)).toStrictEqual(
    sortedMessageArray,
  );
});

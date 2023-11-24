import { expect, test } from '@jest/globals';
import modifyMessage from '../modifyMessage';

const message = {
  conversationId: 2,
  createDate: '2023-11-14T14:38:40.940Z',
  id: 3,
  sender: {
    createDate: '2023-11-14T13:36:08.208Z',
    email: 'lalala@test.de',
    firstName: 'test',
    id: 9,
    lastName: 'testtest',
    password: 'testtesttesttest',
    roleId: 1,
    avatar: '',
  },
  senderId: 9,
  text: 'testtesttest',
};

const modifiedMessage = {
  _id: 3,
  conversationId: 2,
  createDate: '2023-11-14T14:38:40.940Z',
  createdAt: new Date('2023-11-14T14:38:40.940Z'),
  id: 3,
  sender: {
    createDate: '2023-11-14T13:36:08.208Z',
    email: 'lalala@test.de',
    firstName: 'test',
    id: 9,
    lastName: 'testtest',
    password: 'testtesttesttest',
    roleId: 1,
    avatar: '',
  },
  senderId: 9,
  text: 'testtesttest',
  user: { _id: 9, avatar: '', name: 'test' },
};

test('modifies message for gifted chat ui library', () => {
  expect(modifyMessage(message)).toStrictEqual(modifiedMessage);
});

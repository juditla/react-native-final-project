import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {
  getSessionFromAsyncStorage,
  getValidDatabaseSession,
} from '../util/session';

type CurrentUser = {
  firstName: string;
  roleId: number;
  id: number;
  updateUserForSession: (token: string) => void;
};

const UserContext = createContext(undefined);
// const userContext = createContext<UserContext | undefined; setCurrentUser:
//     | Dispatch<SetStateAction<undefined>>
//     | ((currentUser: UserContext) => void);
// } | null>(null);

type Props = { children: ReactNode };

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();

  const updateUserForSession = (token: string, callback?: () => void) => {
    getValidDatabaseSession(token)
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          if (callback) {
            callback();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      // aus AsyncStorage token holen, wenn es das nicht gibt --> nicht logged in
      const token = await getSessionFromAsyncStorage();
      if (token) {
        console.log(token);
        updateUserForSession(token);
      }
    };

    checkLoggedIn().catch((error) => console.log(error));
  }, []);

  console.log('usercontext', currentUser);

  return (
    <UserContext.Provider
      value={{ currentUser: currentUser, setCurrentUser, updateUserForSession }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

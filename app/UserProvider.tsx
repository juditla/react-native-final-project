import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {
  getSessionFromAsyncStorage,
  getValidDatabaseSession,
} from '../util/session';

type CurrentUser = {
  firstName: string;
  roleId: number;
  id: number;
};

type UserContext = {
  currentUser: CurrentUser | null;
  updateUserForSession: (token: string, callback?: () => void) => void;
  setCurrentUser: (currentUser: CurrentUser | null) => void;
};

const UserContext = createContext<UserContext | undefined>(undefined);

type Props = { children: ReactNode };

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
        console.log(' error while checking database session');
        console.log(error);
      });
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      // aus AsyncStorage token holen, wenn es das nicht gibt --> nicht logged in
      const token = await getSessionFromAsyncStorage();
      if (token) {
        updateUserForSession(token);
      }
    };

    checkLoggedIn().catch((error) => {
      console.log('error while checking if logged in');
      console.log(error);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUser: currentUser, setCurrentUser, updateUserForSession }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

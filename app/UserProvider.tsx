import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  getSessionFromAsyncStorage,
  getValidDatabaseSession,
} from '../util/session';

type CurrentUser = {
  firstName: string;
  roleId: number;
  id: number;
};

type UserContextType = {
  currentUser: CurrentUser | null;
  updateUserForSession: (token: string, callback?: () => void) => void;
  setCurrentUser: (currentUser: CurrentUser | null) => void;
  isInitialLoadingFinished: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type Props = { children: ReactNode };

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isInitialLoadingFinished, setIsInitialLoadingFinished] =
    useState(false);

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
      })
      .finally(() => {
        if (!isInitialLoadingFinished) {
          setIsInitialLoadingFinished(true);
        }
      });
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      // aus AsyncStorage token holen, wenn es das nicht gibt --> nicht logged in
      const token = await getSessionFromAsyncStorage();
      if (token) {
        updateUserForSession(token);
      } else {
        setIsInitialLoadingFinished(true);
      }
    };

    checkLoggedIn().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser,
        updateUserForSession,
        isInitialLoadingFinished,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

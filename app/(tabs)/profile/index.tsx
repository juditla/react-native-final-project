import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';

export default function Index() {
  const userContext = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await fetch(
          `${apiDomain}/users/${userContext.currentUser.id}`,
        );
        const json = await response.json();
        setUser(json);
      } catch (error) {
        console.error(error);
      }
    };
    getUserById()
      .then()
      .catch((error) => error);
  }, [userContext, isEditing]);

  console.log(user);
  return isEditing ? (
    <EditProfile
      user={user}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  ) : (
    <ShowProfile
      user={user}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
}

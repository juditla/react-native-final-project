import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Artist, User } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';

export default function Index() {
  const userContext = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [artist, setArtist] = useState<Artist | undefined>();

  useEffect(() => {
    const getArtistByUserId = async (id: number) => {
      try {
        const response = await fetch(`${apiDomain}/artists/${id}`);
        const json = await response.json();
        setArtist(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getUserById = async (id: number) => {
      try {
        const response = await fetch(`${apiDomain}/users/${id}`);
        const json = await response.json();
        setUser(json);
        if (user?.roleId === 1) {
          getArtistByUserId(user.id)
            .then()
            .catch((error) => error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userContext && userContext.currentUser) {
      getUserById(userContext.currentUser.id)
        .then()
        .catch((error) => error);
    } else {
      router.replace('/login');
    }
  }, [userContext, isEditing, user?.id, user?.roleId]);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="black" />
      </View>
    );
  }

  return isEditing ? (
    <EditProfile artist={artist} user={user} setIsEditing={setIsEditing} />
  ) : (
    <ShowProfile artist={artist} user={user} setIsEditing={setIsEditing} />
  );
}

import { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
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
        console.log('USER', user);
        if (user?.roleId === 1) {
          console.log('getting here');
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
    }
  }, [userContext, isEditing, user?.id, user?.roleId]);

  console.log('artisto', artist);
  if (!user) {
    return <Text>Loading...</Text>;
  }

  return isEditing ? (
    <EditProfile artist={artist} user={user} setIsEditing={setIsEditing} />
  ) : (
    <ShowProfile artist={artist} user={user} setIsEditing={setIsEditing} />
  );
}

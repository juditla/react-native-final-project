import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { Artist, TattooImage } from '../../../types';
import UserContext from '../../UserProvider';
import { apiDomain } from '../studios';

type Props = {
  artist: Artist;
  tattooImage?: TattooImage;
  setArtist: (artist: Artist) => void;
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonStyle: {
    borderRadius: 10,
  },
});

export default function RatingComponent({
  artist,
  tattooImage,
  setArtist,
}: Props) {
  const userContext = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [ratingDisabled, setRatingDisabled] = useState(false);

  async function ratingHandler() {
    // redirect to login if no user
    if (!userContext?.currentUser?.id) {
      router.push({
        pathname: '/login',
        params: { returnToPath: `/artists/${artist.userId}` },
      });
    } else {
      if (tattooImage) {
        // implement logic to rate image
      } else {
        try {
          // API - post artist rating
          const ratingResponse = await fetch(
            `${apiDomain}/artists/ratings/${artist.id}`,
            {
              headers: { 'Content-Type': 'application/json' },
              method: 'POST',
              body: JSON.stringify({
                rating,
                userId: userContext.currentUser.id,
              }),
            },
          );
          // receive artist with new rating
          const artistwithNewRating = await ratingResponse.json();
          if (ratingResponse.ok) {
            setRatingDisabled(true);
            setArtist(artistwithNewRating);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  return (
    <View>
      <View style={styles.rowContainer}>
        {/* Create five Iconbuttons for rating  */}
        {[...Array(5)].map((item, index) => {
          return (
            <Button
              key={`value ${index + 1}`}
              onPress={() => setRating(index + 1)}
              style={styles.buttonStyle}
              disabled={ratingDisabled}
            >
              <Icon
                source={rating > index ? 'star' : 'star-outline'}
                size={20}
              />
            </Button>
          );
        })}
      </View>
      <View>
        {/* Button for rating disabled if no stars are chosen or after rating */}
        <Button
          mode="outlined"
          textColor="black"
          style={styles.buttonStyle}
          onPress={async () => await ratingHandler()}
          disabled={rating > 0 && !ratingDisabled ? false : true}
        >
          Rate
        </Button>
      </View>
    </View>
  );
}

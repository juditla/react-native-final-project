export type Studio = {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: number;
  ownerId: number;
  longitude?: string;
  latitude?: string;
  tattooImages?: TattooImage[];
  artist: Artist[];
};

export type Artist = {
  id: number;
  userId: number;
  name: string;
  style: string;
  description: string;
  studioId?: number;
  tattooImages?: TattooImage[];
  user: {
    avatar: string;
    firstName: string;
  };
  studio?: Studio;
  ratingAverage: number;
  ratingCount: number;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  createDate: string;
  avatar: string;
  password: string;
};

export type TattooImage = {
  id: number;
  name: string;
  picture: string;
  artistId: number;
  style: string;
};

export type StudioImage = {
  id: number;
  picutre: string;
};

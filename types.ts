export type Studio = {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: number;
  ownerId: number;
  longitude?: string;
  latitude?: string;
};

export type Artist = {
  id: number;
  userId: number;
  name: string;
  style: string;
  description: string;
  studioId?: number;
  tattooImages?: [TattooImage];
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  createDate: string;
};

export type TattooImage = {
  id: number;
  name: string;
  picture: string;
  artistId: number;
  style: string;
};

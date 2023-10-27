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
  name: string;
  style: string;
  description: string;
  studioId?: number;
};

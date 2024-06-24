export declare type Config = {
  apiKey: string;
  baseUrl?: string;
};

export declare type GetAvatars = {
  id: number;
  name: string;
  thumbnail: string;
};

export declare type CreateRoom = {
  token: string;
  serverUrl: string;
};

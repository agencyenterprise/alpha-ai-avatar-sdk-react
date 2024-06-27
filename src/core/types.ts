export declare type AvatarClientConfig = {
  apiKey: string;
  baseUrl?: string;
  avatarId?: number;
};

export declare type GetAvatarsResponse = {
  id: number;
  name: string;
  thumbnail: string;
}[];

export declare type CreateRoomResponse = {
  token: string;
  serverUrl: string;
};

export declare type GetSupportedVoicesResponse = {
  displayName: string;
  shortName: string;
  gender: string;
  locale: string;
  styleList: string[];
  wordsPerMinute: string;
};

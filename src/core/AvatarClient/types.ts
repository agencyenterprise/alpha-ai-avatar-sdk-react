export declare type Config = {
  apiKey: string;
  baseUrl?: string;
  avatarId?: number;
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

export declare type GetSupportedVoices = {
  displayName: string;
  shortName: string;
  gender: string;
  locale: string;
  styleList: string[];
  wordsPerMinute: string;
};

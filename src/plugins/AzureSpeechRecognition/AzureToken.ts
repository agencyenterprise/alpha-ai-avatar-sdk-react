import Cookie from 'universal-cookie';
import { fetchToken } from './api';
import { GetTokenResponse } from './types';

export class AzureToken {
  static async getToken(
    subscriptionKey: string,
    serviceRegion: string,
  ): Promise<GetTokenResponse> {
    const cookie = new Cookie();
    const speechToken = cookie.get('azure-speech-token');

    if (speechToken === undefined) {
      try {
        const data = await fetchToken(subscriptionKey, serviceRegion);
        if (data.error) {
          throw new Error(data.error);
        }

        const token = data.token;
        const region = data.region;
        cookie.set('azure-speech-token', region + ':' + token, {
          maxAge: 300,
          path: '/',
        }); // tokens for this service expire every 10 minutes, we set the cookie to expire after 5 minutes

        return { token: token, region };
      } catch (error: unknown) {
        console.error(error);
        return { token: null, region: null, error: (error as Error).message };
      }
    } else {
      const idx = speechToken.indexOf(':');
      return {
        token: speechToken.slice(idx + 1),
        region: speechToken.slice(0, idx),
      };
    }
  }
}

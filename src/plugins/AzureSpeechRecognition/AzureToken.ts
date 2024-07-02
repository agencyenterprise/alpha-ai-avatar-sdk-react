import Cookie from 'universal-cookie';
import { getToken } from './api';

export class AzureToken {
  static async getOrRefresh(subscriptionKey: string, serviceRegion: string) {
    const cookie = new Cookie();
    const speechToken = cookie.get('azure-speech-token');

    if (speechToken === undefined) {
      try {
        const data = await getToken(subscriptionKey, serviceRegion);
        const token = data.token;
        const region = data.region;
        cookie.set('azure-speech-token', region + ':' + token, {
          maxAge: 300,
          path: '/',
        }); // tokens for this service expire every 10 minutes, we set the cookie to expire after 5 minutes
        return { authToken: token, region: region };
      } catch (error: unknown) {
        console.error(error);
        return { authToken: null, error };
      }
    } else {
      const idx = speechToken.indexOf(':');
      return {
        authToken: speechToken.slice(idx + 1),
        region: speechToken.slice(0, idx),
      };
    }
  }
}

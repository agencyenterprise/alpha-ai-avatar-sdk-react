import Cookie from 'universal-cookie';
import { fetchToken } from './api';

export class AzureToken {
  static async getToken(subscriptionKey: string, region: string) {
    const cookie = new Cookie();
    const speechToken = cookie.get<string>('azure-speech-token') ?? '';

    let [token, tokenRegion] = speechToken.split(':');

    if (token && tokenRegion === region) {
      return token;
    }

    token = await fetchToken(subscriptionKey, region);

    cookie.set('azure-speech-token', `${region}:${token}`, {
      maxAge: 300,
      path: '/',
    }); // tokens for this service expire every 10 minutes, we set the cookie to expire after 5 minutes

    return token;
  }
}

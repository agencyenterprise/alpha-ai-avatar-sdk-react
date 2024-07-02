import { GetTokenResponse } from './types';

export async function fetchToken(
  subscriptionKey: string,
  serviceRegion: string,
): Promise<GetTokenResponse> {
  try {
    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(
      `https://${serviceRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: headers,
      },
    );
    const tokenResponse = await response.text();
    return { token: tokenResponse, region: serviceRegion };
  } catch (error: unknown) {
    return { token: null, region: null, error: (error as Error).message };
  }
}

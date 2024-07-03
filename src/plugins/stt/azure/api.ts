export async function fetchToken(
  subscriptionKey: string,
  serviceRegion: string,
) {
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

  return await response.text();
}

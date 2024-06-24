export abstract class Base {
  protected invoke<T>(
    url: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...options.headers,
    };

    return fetch(url, { ...options, headers }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
}

export abstract class Base {
  protected async invoke<T>(
    url: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }
}

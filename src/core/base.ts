export abstract class Base {
  private apiKey: string | undefined;

  protected async invoke<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API Key not set');
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

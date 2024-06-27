export class HTTPClient {
  constructor(
    private baseUrl: string,
    private apiKey: string,
  ) {}

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ) {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return (await response.json()) as T;
  }

  protected get<T>(path: string, options: RequestInit = {}) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  protected post<T>(
    path: string,
    data?: any,
    options: RequestInit = {},
  ) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

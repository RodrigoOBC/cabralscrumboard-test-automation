import { expect, APIResponse } from '@playwright/test';

export class IntegracaoAssertions {
  constructor(private response: APIResponse) {}

  static from(response: APIResponse) {
    return new IntegracaoAssertions(response);
  }

  async shouldBeOnline() {
    expect(this.response.status()).toBe(200);

    const body = await this.response.json();

    expect(body).toEqual({
      produto: 'Cabral Scrum Board',
      api: 'online',
      postgresql: 'conectado',
    });

    return this;
  }
}
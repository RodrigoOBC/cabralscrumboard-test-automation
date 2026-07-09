import { APIRequestContext } from '@playwright/test';

export class IntegracaoClient {
  readonly request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async healthCheck() {
    return this.request.get('/integracao');
  }
}
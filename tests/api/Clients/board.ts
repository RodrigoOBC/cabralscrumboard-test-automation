import { APIRequestContext } from '@playwright/test';

export class BoardsClient {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
 
  async getBoardsByStatus(status: string) {
    const response = await this.request.get(`/boards?includeArchived=${status}`);
    return response;
  }

  async create(board: { nome: string; dataInicio: string; descricao: string }) {
    return this.request.post('/boards', {
      data: board,
    });
  }
  
}

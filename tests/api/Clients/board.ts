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

  async getById(boardId: string, tagIds?: string[]) {
    const query = tagIds?.length
      ? `?${tagIds.map((tagId) => `tagIds=${tagId}`).join('&')}`
      : '';

    return this.request.get(`/boards/${boardId}${query}`);
  }

  async create(board: { nome: string; dataInicio: string; descricao: string }) {
    return this.request.post('/boards', {
      data: board,
    });
  }

  async archive(boardId: string) {
    return this.request.post(`/boards/${boardId}/archive`);
  }

  async restore(boardId: string) {
    return this.request.post(`/boards/${boardId}/restore`);
  }
  
}

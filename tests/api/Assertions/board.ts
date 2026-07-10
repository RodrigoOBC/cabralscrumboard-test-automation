import { expect, APIResponse } from '@playwright/test';

export class BoardAssertions {
    constructor(private response: APIResponse) { }

    static from(response: APIResponse) {
        return new BoardAssertions(response);
    }

    async shouldBeValidBoardList() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    nome: expect.any(String),
                    dataInicio: expect.any(String),
                    descricao: expect.any(String),
                    arquivado: expect.any(Boolean),
                    criadoEm: expect.any(String),
                    atualizadoEm: expect.any(String)
                })
            ])
        );

        return this;
    }

    async shouldBeWithArchivedBoards() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    arquivado: true
                })
            ])
        );

        return this;
    }

    async shouldBeOnlyActiveBoards() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    arquivado: false
                })
            ])
        );

        expect(body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    arquivado: true
                })
            ])
        );

        return this;
    }
}
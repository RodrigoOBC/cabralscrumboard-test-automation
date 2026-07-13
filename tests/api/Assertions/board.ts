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

    async shouldBeCreated() {
        expect(this.response.status()).toBe(201);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                nome: expect.any(String),
                dataInicio: expect.any(String),
                descricao: expect.any(String),
                arquivado: false,
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String)
            })
        );

        return this;
    }

    async shouldHaveName(nome: string) {
        const body = await this.response.json();
        expect(body.nome).toBe(nome);

        return this;
    }

    async shouldHaveStartDate(dataInicio: string) {
        const body = await this.response.json();
        expect(body.dataInicio).toBe(dataInicio);

        return this;
    }

    async shouldHaveDescription(descricao: string) {
        const body = await this.response.json();
        expect(body.descricao).toBe(descricao);

        return this;
    }

    async shouldBeBadRequest() {
        expect(this.response.status()).toBe(400);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                message: expect.any(Array),
                error: 'Bad Request',
                statusCode: 400
            })
        );

        return this;
    }

    async shouldHaveValidationMessage(message: string) {
        const body = await this.response.json();

        expect(body.message).toContain(message);

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

import { expect, APIResponse } from '@playwright/test';

export class BoardAssertions {
    constructor(private response: APIResponse) { }

    static from(response: APIResponse) {
        return new BoardAssertions(response);
    }

    private expectSubtaskStructure(subtask: Record<string, unknown>) {
        expect(subtask).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                sequencia: expect.any(Number),
                tipo: expect.any(String),
                titulo: expect.any(String),
                status: expect.any(String),
                tags: expect.any(Array),
                arquivado: expect.any(Boolean),
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String)
            })
        );

        if ('descricao' in subtask && subtask.descricao !== undefined) {
            expect(subtask.descricao).toEqual(expect.any(String));
        }
    }

    private expectCardStructure(card: Record<string, unknown>) {
        expect(card).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                tipo: expect.any(String),
                sequencia: expect.any(Number),
                titulo: expect.any(String),
                responsavel: expect.any(String),
                prioridade: expect.any(String),
                status: expect.any(String),
                tags: expect.any(Array),
                historico: expect.any(Array),
                subtarefas: expect.any(Array),
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String),
                arquivado: expect.any(Boolean)
            })
        );

        if ('descricao' in card && card.descricao !== undefined) {
            expect(card.descricao).toEqual(expect.any(String));
        }

        if ('dataEntrega' in card && card.dataEntrega !== undefined) {
            expect(card.dataEntrega).toEqual(expect.any(String));
        }

        for (const tag of card.tags as Record<string, unknown>[]) {
            expect(tag).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    nome: expect.any(String),
                    cor: expect.any(String)
                })
            );
        }

        for (const historyItem of card.historico as Record<string, unknown>[]) {
            expect(historyItem).toEqual(
                expect.objectContaining({
                    tipo: expect.any(String),
                    data: expect.any(String)
                })
            );
        }

        for (const subtask of card.subtarefas as Record<string, unknown>[]) {
            this.expectSubtaskStructure(subtask);
        }
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

    async shouldBeValidBoardDetails() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                nome: expect.any(String),
                dataInicio: expect.any(String),
                descricao: expect.any(String),
                arquivado: expect.any(Boolean),
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String),
                backlog: expect.objectContaining({
                    cards: expect.any(Array)
                }),
                steps: expect.any(Array)
            })
        );

        return this;
    }

    async shouldHaveId(boardId: string) {
        const body = await this.response.json();

        expect(body.id).toBe(boardId);

        return this;
    }

    async shouldExposeBoardCardsAndSubtasks() {
        const body = await this.response.json();
        const backlogCards = body.backlog.cards;
        const stepCards = body.steps.flatMap((step: { cards: Record<string, unknown>[] }) => step.cards);

        expect(backlogCards.length).toBeGreaterThan(0);
        expect(stepCards.length).toBeGreaterThan(0);

        for (const card of backlogCards) {
            this.expectCardStructure(card);
        }

        for (const step of body.steps) {
            expect(step).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    nome: expect.any(String),
                    cor: expect.any(String),
                    cards: expect.any(Array)
                })
            );

            for (const card of step.cards) {
                this.expectCardStructure(card);
            }
        }

        return this;
    }

    async shouldContainFilteredCardsByTag(tagId: string) {
        const body = await this.response.json();

        for (const step of body.steps) {
            for (const card of step.cards) {
                const hasTag = card.tags.some((tag: { id: string }) => tag.id === tagId);
                expect(hasTag).toBe(true);
            }
        }

        return this;
    }

    async shouldContainOnlyCardsMatchingAnyTag(tagIds: string[]) {
        const body = await this.response.json();
        const cards = [
            ...body.backlog.cards,
            ...body.steps.flatMap((step: { cards: Record<string, unknown>[] }) => step.cards)
        ];

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const cardTagIds = card.tags.map((tag: { id: string }) => tag.id);
            expect(cardTagIds.some((tagId: string) => tagIds.includes(tagId))).toBe(true);
        }

        return this;
    }

    async shouldHaveFilteredCardsInBacklogAndSteps() {
        const body = await this.response.json();
        const backlogCards = body.backlog.cards;
        const stepCards = body.steps.flatMap((step: { cards: Record<string, unknown>[] }) => step.cards);

        expect(backlogCards.length).toBeGreaterThan(0);
        expect(stepCards.length).toBeGreaterThan(0);

        return this;
    }

    async shouldCoverRequestedTags(tagIds: string[]) {
        const body = await this.response.json();
        const cards = [
            ...body.backlog.cards,
            ...body.steps.flatMap((step: { cards: Record<string, unknown>[] }) => step.cards)
        ];

        for (const tagId of tagIds) {
            expect(
                cards.some((card: { tags: { id: string }[] }) => card.tags.some((tag) => tag.id === tagId))
            ).toBe(true);
        }

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

    async shouldBeCreatedWithoutDescription() {
        expect(this.response.status()).toBe(201);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                nome: expect.any(String),
                dataInicio: expect.any(String),
                arquivado: false,
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String)
            })
        );

        expect(body.descricao).toBeUndefined();

        return this;
    }

    async shouldBeArchived() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                nome: expect.any(String),
                dataInicio: expect.any(String),
                arquivado: true,
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String)
            })
        );

        return this;
    }

    async shouldBeArchivedStatus() {
        const body = await this.response.json();

        expect(body.arquivado).toBe(true);

        return this;
    }

    async shouldBeRestored() {
        expect(this.response.status()).toBe(200);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                nome: expect.any(String),
                dataInicio: expect.any(String),
                arquivado: false,
                criadoEm: expect.any(String),
                atualizadoEm: expect.any(String)
            })
        );

        return this;
    }

    async shouldBeActiveStatus() {
        const body = await this.response.json();

        expect(body.arquivado).toBe(false);

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

    async shouldBeBadRequestWithMessage(message: string) {
        expect(this.response.status()).toBe(400);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                message,
                error: 'Bad Request',
                statusCode: 400
            })
        );

        return this;
    }

    async shouldBeNotFound() {
        expect(this.response.status()).toBe(404);

        const body = await this.response.json();

        expect(body).toEqual(
            expect.objectContaining({
                message: expect.anything(),
                error: 'Not Found',
                statusCode: 404
            })
        );

        return this;
    }

    async shouldHaveErrorMessage(message: string) {
        const body = await this.response.json();

        expect(body.message).toBe(message);

        return this;
    }

    async shouldHaveValidationMessage(message: string) {
        const body = await this.response.json();

        expect(body.message).toContain(message);

        return this;
    }

    async shouldHaveValidationMessages(messages: string[]) {
        const body = await this.response.json();

        expect(body.message).toEqual(expect.arrayContaining(messages));

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

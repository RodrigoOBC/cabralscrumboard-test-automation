import { test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { BoardsClient } from '../Clients/board';
import { BoardAssertions } from '../Assertions/board';
import { BoardBuilder } from '../Builders/board';

test.describe('Boards API', () => {
  let boardsClient: BoardsClient;

  test.beforeEach(async ({ request }) => {
    boardsClient = new BoardsClient(request);
  });

  test.describe('GET /boards', () => {
    test('Should validate the list of boards', async () => {
      const response = await boardsClient.getBoardsByStatus('false');

      await BoardAssertions
        .from(response)
        .shouldBeValidBoardList();
    });

    test('Should validate only archived boards', async () => {
      const response = await boardsClient.getBoardsByStatus('true');

      await BoardAssertions
        .from(response)
        .shouldBeWithArchivedBoards();
    });

    test('Should validate only active boards', async () => {
      const response = await boardsClient.getBoardsByStatus('false');

      await BoardAssertions
        .from(response)
        .shouldBeOnlyActiveBoards();
    });
  });

  test.describe('POST /boards', () => {
  test('Should create a board with unique name', async () => {
    const board = BoardBuilder
      .valid()
        .withUniqueName('TESTER')
        .withStartDate('2026-12-11')
        .withDescription('TESTE')
        .build();

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeCreated();

      await BoardAssertions
        .from(response)
        .shouldHaveName(board.nome);

      await BoardAssertions
        .from(response)
        .shouldHaveStartDate(board.dataInicio);

    await BoardAssertions
      .from(response)
      .shouldHaveDescription(board.descricao);
  });

  test('Should archive an active board', async () => {
    const board = BoardBuilder
      .valid()
      .withUniqueName('TESTER')
      .withStartDate('2026-12-11')
      .withDescription('TESTE')
      .build();

    const createResponse = await boardsClient.create(board);
    const createdBoard = await createResponse.json();

    const archiveResponse = await boardsClient.archive(createdBoard.id);

    await BoardAssertions
      .from(archiveResponse)
      .shouldBeArchived();

    await BoardAssertions
      .from(archiveResponse)
      .shouldHaveName(board.nome);

    await BoardAssertions
      .from(archiveResponse)
      .shouldHaveStartDate(board.dataInicio);

    await BoardAssertions
      .from(archiveResponse)
      .shouldHaveDescription(board.descricao);

    await BoardAssertions
      .from(archiveResponse)
      .shouldBeArchivedStatus();
  });

  test('Should return not found when archiving a non-existent board', async () => {
    const boardId = randomUUID();

    const response = await boardsClient.archive(boardId);

    await BoardAssertions
      .from(response)
      .shouldBeNotFound();

    await BoardAssertions
      .from(response)
      .shouldHaveErrorMessage('Board não encontrado.');
  });

  test('Should validate required board name', async () => {
    const board = BoardBuilder
        .valid()
        .withName('')
        .withStartDate('2026-12-11')
        .withDescription('TESTE')
        .build();

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessage('O nome do board é obrigatório.');
    });

    test('Should validate board name as text', async () => {
      const board = {
        ...BoardBuilder
          .valid()
          .withStartDate('2026-12-11')
          .withDescription('TESTE')
          .build(),
        nome: null,
      };

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessages([
          'O nome do board é obrigatório.',
          'O nome do board deve ser texto.',
        ]);
    });

    test('Should create a board without description when description is null', async () => {
      const board = {
        ...BoardBuilder
          .valid()
          .withUniqueName('TESTER')
          .withStartDate('2026-12-11')
          .build(),
        descricao: null,
      };

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeCreatedWithoutDescription();

      await BoardAssertions
        .from(response)
        .shouldHaveName(board.nome);

      await BoardAssertions
        .from(response)
        .shouldHaveStartDate(board.dataInicio);
    });

    test('Should validate required board start date', async () => {
      const board = BoardBuilder
        .valid()
        .withUniqueName('TESTER')
        .withStartDate('')
        .withDescription('TESTE')
        .build();

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessage('A data de início deve ser uma data válida.');
    });

    test('Should validate required board start date when null', async () => {
      const board = {
        ...BoardBuilder
          .valid()
          .withUniqueName('TESTER')
          .withDescription('TESTE')
          .build(),
        dataInicio: null,
      };

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessage('A data de início deve ser uma data válida.');
    });

    test('Should validate board name when numeric', async () => {
      const board = {
        ...BoardBuilder
          .valid()
          .withStartDate('2026-12-11')
          .withDescription('TESTE')
          .build(),
        nome: 123,
      };

      const response = await boardsClient.create(board);

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessages([
          'O nome do board é obrigatório.',
          'O nome do board deve ser texto.',
        ]);
    });

    test('Should validate required board name when field is missing', async () => {
      const board = {
        dataInicio: '2026-12-11',
        descricao: 'TESTE',
      };

      const response = await boardsClient.create(board as { nome: string; dataInicio: string; descricao: string });

      await BoardAssertions
        .from(response)
        .shouldBeBadRequest();

      await BoardAssertions
        .from(response)
        .shouldHaveValidationMessages([
          'O nome do board é obrigatório.',
          'O nome do board deve ser texto.',
        ]);
    });
  });

  
});

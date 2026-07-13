imp

import { test } from '@playwright/test';
import { BoardsClient } from '../Clients/board';
import { BoardAssertions } from '../Assertions/board';
import { BoardBuilder } from '../Builders/board';

test.describe('Boards API', () => {
  let boardsClient: BoardsClient;

  test.beforeEach(async ({ request }) => {
    boardsClient = new BoardsClient(request);
  });

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
});

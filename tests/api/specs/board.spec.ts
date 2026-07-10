import { test } from '@playwright/test';
import { BoardsClient } from '../Clients/board';
import { BoardAssertions } from '../Assertions/board';

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
});
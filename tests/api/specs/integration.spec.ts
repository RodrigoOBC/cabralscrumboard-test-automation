import { test } from '@playwright/test';
import { IntegracaoAssertions } from '../Assertions/intagration';
import { IntegracaoClient } from '../Clients/intagration';

test('Should validate integration API status', async ({request}) => {
  const integracaoClient = new IntegracaoClient(request)
  const response = await integracaoClient.healthCheck();

  await IntegracaoAssertions
    .from(response)
    .shouldBeOnline();
});
export const integracaoSchema = {
  type: 'object',
  required: ['produto', 'api', 'postgresql'],
  properties: {
    produto: { type: 'string' },
    api: { type: 'string' },
    postgresql: { type: 'string' },
  },
  additionalProperties: false,
};
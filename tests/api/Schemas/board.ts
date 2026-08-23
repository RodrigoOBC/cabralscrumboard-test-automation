export const GetBoardsByStatusSucessSchema = {
    "type": "array",
    "items": {
        "type": "object",
        "required": ["id", "nome", "dataInicio", "descricao", "arquivado", "criadoEm", "atualizadoEm"],
        "properties": {
            "id": {
                "type": "string",
                "format": "uuid"
            },
            "nome": {
                "type": "string"
            },
            "dataInicio": {
                "type": "string",
                "format": "date"
            },
            "descricao": {
                "type": "string"
            },
            "arquivado": {
                "type": "boolean"
            },
            "criadoEm": {
                "type": "string",
                "format": "date-time"
            },
            "atualizadoEm": {
                "type": "string",
                "format": "date-time"
            }
        },
        "additionalProperties": false
    }
}

export const CreateBoardSuccessSchema = {
    type: 'object',
    required: ['id', 'nome', 'dataInicio', 'descricao', 'arquivado', 'criadoEm', 'atualizadoEm'],
    properties: {
        id: {
            type: 'string',
            format: 'uuid'
        },
        nome: {
            type: 'string'
        },
        dataInicio: {
            type: 'string',
            format: 'date'
        },
        descricao: {
            type: 'string'
        },
        arquivado: {
            type: 'boolean'
        },
        criadoEm: {
            type: 'string',
            format: 'date-time'
        },
        atualizadoEm: {
            type: 'string',
            format: 'date-time'
        }
    },
    additionalProperties: false
}

export const BoardValidationErrorSchema = {
    type: 'object',
    required: ['message', 'error', 'statusCode'],
    properties: {
        message: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        error: {
            type: 'string'
        },
        statusCode: {
            type: 'number'
        }
    },
    additionalProperties: false
}

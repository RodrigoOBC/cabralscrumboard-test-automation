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
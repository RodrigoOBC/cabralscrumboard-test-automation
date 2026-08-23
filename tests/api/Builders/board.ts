type CreateBoardPayload = {
  nome: string;
  dataInicio: string;
  descricao: string;
};

export class BoardBuilder {
  private payload: CreateBoardPayload;

  private constructor() {
    this.payload = {
      nome: BoardBuilder.buildUniqueName('TESTER'),
      dataInicio: '2026-12-11',
      descricao: 'TESTE',
    };
  }

  static valid() {
    return new BoardBuilder();
  }

  withName(nome: string) {
    this.payload.nome = nome;
    return this;
  }

  withUniqueName(prefix = 'TESTER') {
    this.payload.nome = BoardBuilder.buildUniqueName(prefix);
    return this;
  }

  withStartDate(dataInicio: string) {
    this.payload.dataInicio = dataInicio;
    return this;
  }

  withDescription(descricao: string) {
    this.payload.descricao = descricao;
    return this;
  }

  build() {
    return { ...this.payload };
  }

  private static buildUniqueName(prefix: string) {
    return `${prefix}-${Date.now()}`;
  }
}

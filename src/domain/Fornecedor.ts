export class Fornecedor {
  private readonly nome: string;
  private readonly qualidade: number;
  private readonly prazoDeEntrega: number;
  private readonly precos: Record<string, number>;

  constructor(
    nome: string,
    qualidade: number,
    prazoDeEntrega: number,
    precos: Record<string, number>,
  ) {
    if (!nome || nome.trim() === "") {
      throw new Error("O nome do fornecedor é obrigatório.");
    }
    if (!Number.isInteger(qualidade) || qualidade < 1 || qualidade > 5) {
      throw new Error("A qualidade do fornecedor deve ser um inteiro entre 1 e 5.");
    }
    if (!Number.isInteger(prazoDeEntrega) || prazoDeEntrega < 0) {
      throw new Error("O prazo de entrega deve ser um inteiro maior ou igual a zero.");
    }

    this.nome = nome;
    this.qualidade = qualidade;
    this.prazoDeEntrega = prazoDeEntrega;
    this.precos = { ...precos };
  }

  getNome(): string {
    return this.nome;
  }

  getQualidade(): number {
    return this.qualidade;
  }

  getPrazoDeEntrega(): number {
    return this.prazoDeEntrega;
  }

  precoDe(ingrediente: string): number {
    if (!(ingrediente in this.precos)) {
      throw new Error(`O fornecedor ${this.nome} não vende o ingrediente ${ingrediente}.`);
    }
    return this.precos[ingrediente];
  }

  listarPrecos(): Record<string, number> {
    return { ...this.precos };
  }
}

export function fornecedoresIniciais(): Fornecedor[] {
  return [
    new Fornecedor("Mercadinho do Bairro", 3, 0, {
      cafe: 120,
      leite: 80,
      massa: 150,
    }),
    new Fornecedor("Grãos Premium", 5, 1, {
      cafe: 180,
      leite: 110,
      massa: 200,
    }),
    new Fornecedor("Atacado Central", 2, 2, {
      cafe: 90,
      leite: 60,
      massa: 110,
    }),
  ];
}
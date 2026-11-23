export interface LoteJSON {
  ingrediente: string;
  quantidade: number;
  diasParaVencer: number;
  custoUnitario: number;
  qualidade: number;
}

export class LoteDeIngrediente {
  private readonly ingrediente: string;
  private quantidade: number;
  private diasParaVencer: number;
  private readonly custoUnitario: number;
  private readonly qualidade: number;

  constructor(
    ingrediente: string,
    quantidade: number,
    diasParaVencer: number,
    custoUnitario: number,
    qualidade: number,
  ) {
    if (!ingrediente || ingrediente.trim() === "") {
      throw new Error("O nome do ingrediente é obrigatório.");
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("A quantidade do lote deve ser um inteiro positivo.");
    }
    if (!Number.isInteger(diasParaVencer) || diasParaVencer <= 0) {
      throw new Error("Os dias para vencer devem ser um inteiro positivo.");
    }
    if (!Number.isInteger(custoUnitario) || custoUnitario <= 0) {
      throw new Error("O custo unitário deve ser um inteiro positivo.");
    }
    if (!Number.isInteger(qualidade) || qualidade < 1 || qualidade > 5) {
      throw new Error("A qualidade do lote deve ser um inteiro entre 1 e 5.");
    }

    this.ingrediente = ingrediente;
    this.quantidade = quantidade;
    this.diasParaVencer = diasParaVencer;
    this.custoUnitario = custoUnitario;
    this.qualidade = qualidade;
  }

  getIngrediente(): string {
    return this.ingrediente;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  getDiasParaVencer(): number {
    return this.diasParaVencer;
  }

  getCustoUnitario(): number {
    return this.custoUnitario;
  }

  getQualidade(): number {
    return this.qualidade;
  }

  novoDia(): void {
    this.diasParaVencer -= 1;
  }

  venceu(): boolean {
    return this.diasParaVencer <= 0;
  }

  retirar(quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("A quantidade a retirar deve ser um inteiro positivo.");
    }
    if (quantidade > this.quantidade) {
      throw new Error("Quantidade insuficiente neste lote.");
    }
    this.quantidade -= quantidade;
  }

  estaVazio(): boolean {
    return this.quantidade === 0;
  }

  paraJSON(): LoteJSON {
    return {
      ingrediente: this.ingrediente,
      quantidade: this.quantidade,
      diasParaVencer: this.diasParaVencer,
      custoUnitario: this.custoUnitario,
      qualidade: this.qualidade,
    };
  }

  static restaurarEstado(dados: LoteJSON): LoteDeIngrediente {
    return new LoteDeIngrediente(
      dados.ingrediente,
      dados.quantidade,
      dados.diasParaVencer,
      dados.custoUnitario,
      dados.qualidade,
    );
  }
}
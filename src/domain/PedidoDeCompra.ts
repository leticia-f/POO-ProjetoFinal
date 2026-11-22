import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";

export interface PedidoDeCompraJSON {
  fornecedor: string;
  ingrediente: string;
  quantidade: number;
  custoUnitario: number;
  diasParaChegar: number;
  qualidade: number;
}

export class PedidoDeCompra implements AtualizavelPorDia {
  private readonly fornecedor: string;
  private readonly ingrediente: string;
  private readonly quantidade: number;
  private readonly custoUnitario: number;
  private diasParaChegar: number;
  private readonly qualidade: number;

  constructor(
    fornecedor: string,
    ingrediente: string,
    quantidade: number,
    custoUnitario: number,
    diasParaChegar: number,
    qualidade = 3,
  ) {
    if (!fornecedor || fornecedor.trim() === "") {
      throw new Error("O nome do fornecedor é obrigatório.");
    }
    if (!ingrediente || ingrediente.trim() === "") {
      throw new Error("O nome do ingrediente é obrigatório.");
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("A quantidade do pedido deve ser um inteiro positivo.");
    }
    if (!Number.isInteger(custoUnitario) || custoUnitario <= 0) {
      throw new Error("O custo unitário do pedido deve ser um inteiro positivo.");
    }
    if (!Number.isInteger(diasParaChegar) || diasParaChegar <= 0) {
      throw new Error("Os dias para chegar devem ser um inteiro positivo.");
    }

    this.fornecedor = fornecedor;
    this.ingrediente = ingrediente;
    this.quantidade = quantidade;
    this.custoUnitario = custoUnitario;
    this.diasParaChegar = diasParaChegar;
    this.qualidade = qualidade;
  }

  getFornecedor(): string {
    return this.fornecedor;
  }

  getIngrediente(): string {
    return this.ingrediente;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  getCustoUnitario(): number {
    return this.custoUnitario;
  }

  getDiasParaChegar(): number {
    return this.diasParaChegar;
  }

  getQualidade(): number {
    return this.qualidade;
  }

  novoDia(): void {
    this.diasParaChegar -= 1;
  }

  chegou(): boolean {
    return this.diasParaChegar <= 0;
  }

  paraJSON(): PedidoDeCompraJSON {
    return {
      fornecedor: this.fornecedor,
      ingrediente: this.ingrediente,
      quantidade: this.quantidade,
      custoUnitario: this.custoUnitario,
      diasParaChegar: this.diasParaChegar,
      qualidade: this.qualidade,
    };
  }

  static restaurarEstado(dados: PedidoDeCompraJSON): PedidoDeCompra {
    return new PedidoDeCompra(
      dados.fornecedor,
      dados.ingrediente,
      dados.quantidade,
      dados.custoUnitario,
      dados.diasParaChegar,
      dados.qualidade,
    );
  }
}
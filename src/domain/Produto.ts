import type { Receita } from "./Receita.ts";
import type { ItemDoCardapio } from "./ItemDoCardapio.ts";

export interface ProdutoJSON {
  nome: string;
  receita: Receita;
  preco: number;
}

export class Produto implements ItemDoCardapio {
  public readonly nome: string;
  private readonly ingredientes: Receita;
  private preco: number;

  constructor(nome: string, receita: Receita, preco: number) {
    if (typeof nome !== "string" || nome.trim() === "") {
      throw new Error("O nome do produto não pode ser vazio.");
    }
    if (receita === null || typeof receita !== "object" || Array.isArray(receita) ||
      Object.keys(receita).length === 0) {
      throw new Error("A receita deve ter pelo menos um ingrediente.");
    }
    for (const [ingrediente, quantidade] of Object.entries(receita)) {
      if (ingrediente.trim() === "" || !Number.isSafeInteger(quantidade) || quantidade <= 0) {
        throw new Error("Os ingredientes devem ter nomes e quantidades inteiras positivas.");
      }
    }
    this.nome = nome.trim();
    this.ingredientes = { ...receita };
    this.preco = 0;
    this.definirPreco(preco);
  }

  get receita(): Receita {
    return { ...this.ingredientes };
  }

  getPreco(): number {
    return this.preco;
  }

  definirPreco(preco: number): void {
    if (!Number.isSafeInteger(preco) || preco <= 0) {
      throw new Error("O preço deve ser um inteiro positivo em centavos.");
    }
    this.preco = preco;
  }

  custoEstimado(custoDe: (ingrediente: string) => number): number {
    let total = 0;
    for (const [ingrediente, quantidade] of Object.entries(this.ingredientes)) {
      const custoUnitario = custoDe(ingrediente);
      if (!Number.isFinite(custoUnitario) || custoUnitario < 0) {
        throw new Error("O custo do ingrediente deve ser válido e não negativo.");
      }
      total += quantidade * custoUnitario;
    }
    return Math.round(total);
  }

  margem(custoDe: (ingrediente: string) => number): number {
    return this.preco - this.custoEstimado(custoDe);
  }

  paraJSON(): ProdutoJSON {
    return { nome: this.nome, receita: this.receita, preco: this.preco };
  }

  static restaurarEstado(dados: ProdutoJSON): Produto {
    return new Produto(dados.nome, dados.receita, dados.preco);
  }
}

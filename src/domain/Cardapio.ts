import { Produto } from "./Produto.ts";
import type { ProdutoJSON } from "./Produto.ts";

export interface CardapioJSON {
  produtos: ProdutoJSON[];
}

export class Cardapio {
  private produtos: Produto[] = [];

  adicionar(produto: Produto): void {
    if (this.produtos.some((item) => item.nome.toLocaleLowerCase("pt-BR") ===
      produto.nome.toLocaleLowerCase("pt-BR"))) {
      throw new Error("Já existe um produto com esse nome.");
    }
    this.produtos.push(produto);
  }

  encontrar(nome: string): Produto | undefined {
    return this.produtos.find((produto) =>
      produto.nome.toLocaleLowerCase("pt-BR") === nome.trim().toLocaleLowerCase("pt-BR")
    );
  }

  remover(nome: string): void {
    const produto = this.encontrar(nome);
    if (!produto) throw new Error("Produto não encontrado.");
    this.produtos = this.produtos.filter((item) => item !== produto);
  }

  definirPreco(nome: string, preco: number): void {
    const produto = this.encontrar(nome);
    if (!produto) throw new Error("Produto não encontrado.");
    produto.definirPreco(preco);
  }

  listar(): readonly Produto[] {
    return [...this.produtos];
  }

  paraJSON(): CardapioJSON {
    return { produtos: this.produtos.map((produto) => produto.paraJSON()) };
  }

  restaurarEstado(dados: CardapioJSON): void {
    if (!dados || !Array.isArray(dados.produtos)) {
      throw new Error("Dados do cardápio inválidos.");
    }
    const novoCardapio = new Cardapio();
    for (const dadosProduto of dados.produtos) {
      novoCardapio.adicionar(Produto.restaurarEstado(dadosProduto));
    }
    this.produtos = [...novoCardapio.listar()];
  }
}

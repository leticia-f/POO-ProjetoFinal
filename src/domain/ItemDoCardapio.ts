import type { Receita } from "./Receita.ts";

export interface ItemDoCardapio {
  readonly nome: string;
  readonly receita: Receita;
  getPreco(): number;
}

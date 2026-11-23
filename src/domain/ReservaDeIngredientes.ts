import type { Receita } from "./Receita.ts";

export interface ReservaDeIngredientes {
  temPara(receita: Receita): boolean;
  consumir(receita: Receita): number;
}
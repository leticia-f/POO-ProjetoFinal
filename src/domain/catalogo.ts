import { Cardapio } from "./Cardapio.ts";
import { Produto } from "./Produto.ts";

export function cardapioInicial(): Cardapio {
  const cardapio = new Cardapio();
  cardapio.adicionar(new Produto("Espresso", { cafe: 1 }, 600));
  cardapio.adicionar(new Produto("Cappuccino", { cafe: 1, leite: 1 }, 1200));
  cardapio.adicionar(new Produto("Pão de queijo", { massa: 1 }, 500));
  return cardapio;
}

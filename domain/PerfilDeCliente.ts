import type { ItemDoCardapio } from "./ItemDoCardapio.ts";
import type { Sorteados } from "./Sorteador.ts";

export interface PerfilDeCliente{
    readonly nome: string;
    escolher (cardapio: readonly ItemDoCardapio[], sorteador: Sorteador): ItemDoCardapio | undefined;
    satisfacao (preco: number, qualidade: number, sorteador: Sorteador): number;
}
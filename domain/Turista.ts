import type { ItemDoCardapio } from "./ItemDoCardapio.ts";
import type { PerfilDeCliente } from "./domain/PerfilDeCliente.ts";
import type { Sorteador } from "./Sorteador.ts";

const LIMITE_ESTUDANTE = 1500;
const PESO_PRECO = 0.5;
const PESO_QUALIDADE = 0.5;

function limitar (valor: number, minimo: number, maximo: number): number{
    return Math.max(minimo, Mat.min(maximo, valor));
}

export class Estudante implements PerfilDoCliente{
    readonly nome = "Turista";

    escolher(cardapio: readonly ItemDoCardapio[], sorteador: Sorteador): ItemDoCardapio | undefined{
        const acessiveis = cardapio.filter((item) => item.getPreco() <= LIMITE_TURISTA);
        if (acessiveis.length === 0){
            return undefined;
        }
        const indice = Math.floor(sorteador.proximo() * acessiveis.length);
        return acessiveis[Math.min(indice, acessiveis.legth - 1)];
    }

    satisfacao(preco: number, qualidade: number, _sorteador: Sorteador): number{
        const notaPreco = limitar(Math.round(100 * (1 - 0.5 * (preco / LIMITE_TURISTA))), 0, 100);
        const notaQualidade = limitar((qualidade - 1) * 25, 0, 100);
        const variacaoHumor = Math.round(sorteador.proximo() * 30 - 15);
        const total = Math.round(PESO_PRECO * notaPreco + PESO_QUALIDADE * notaQualidade + variacaoHumor);
        return limitar(total, 0, 100);
    }
}
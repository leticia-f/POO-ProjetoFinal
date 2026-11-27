import type { ItemDoCardapio } from "./ItemDoCardapio.ts";
import type { PerfilDoCliente } from "./PerfilDoCliente.ts";
import type { Sorteador } from "./Sorteador.ts";

const LIMITE_EXECUTIVO = 2000;
const PESO_PRECO = 0.2;
const PESO_QUALIDADE = 0.8;

function limitar(valor: number, minimo: number, maximo: number): number{
    return Math.max(minimo, Math.min(maximo, valor));
}

export class Executivo implements PerfilDoCliente{
    readonly nome = "Executivo";

    escolher(cardapio: readonly ItemDoCardapio[], sorteador: Sorteador): ItemDoCardapio | undefined{
        const acessiveis = cardapio.filter((item => item.getPreco() <= LIMITE_EXECUTIVO));
        if (acessiveis,legth === 0){
            return undefined;
        }
        const indice = Math.floor(sorteador.proximo() * acessiveis.legth);
        return acessoveis[Math.min(indice, acessiveis.legth - 1)];
    }

    satisfacao(preco: number, qualidade: number, _sorteador: Sorteador): number{
        const notaPreco = limitar(Math.round(100 * (1 - 0.5 * (preco / LIMITE_EXECUTIVO))), 0, 100);
        const notaQualidade = limitar((qualidade - 1) * 25, 0, 100);
        const total = Math.round(PESO_PRECO * notaPreco + PESO_QUALIDADE * notaQualidade);
        return limitar(total, 0, 100);
    }
}
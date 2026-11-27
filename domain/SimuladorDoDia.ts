import { Estudante } from "./Estudante.ts";
import { Executivo } from "./Executivo.ts";
import { Turista } from "./Turista.ts";
import type { ItemDoCardapio } from "./ItemDoCardapio.ts";
import type { PerfilDoCliente } from "./PerfilDoCliente.ts";
import type { Receita } from "./Receita.ts";
import type { ReservaDeIngredientes } from "./ReservaDeIngredientes.ts";
import type { Sorteador } from "./Sorteador.ts";

export interface EntradaDoDia {
    cardapio: readonly ItemDoCardapio[];
    reserva: ReservaDeIngredientes;
    capacidade: number;
    demandaBase: number;
    reputacao: number;
    multiplicadorDeDemanda: number;
}

export interface ResultadoDoDia{
    clientesAtendidos: number; perdidosPorEstoque: number;
    perdidosPorAtendimento: number;
    receita: number;
    satisfacaoMedia: number;
}

export class SimuladorDoDia{
    private readonly estudante = new Estudante();
    private readonly executivo = new Executivo();
    private readonly turista = new Turista();

    constructor(private readonly sorteador: Sorteador){}

    private sortearPerfil(): PerfilDeCliente{
        const r = this.sorteador.proximo();
        if (r < 0.5){
            return this.estudante;
        }
        if (r < 0.8){
            return this.executivo;
        }
        return this.turista;
    }

    simular(entrada: EntradaDoDia): ResultadoDoDia{
        const clientesDoDia = Math.round(entrada.demandaBase * (0.5 + entrada.reputacao / 100) * entrada.multiplicadorDeDemanda);

        const capacidadeUtil = Math.max(0, entrada.capacidade);
        const atendidosAlvo = Math.min(clientesDoDia, capacidadeUtil);
        const perdidosPorAtendimento = Math.max(0, clientesDoDia - capacidadeUtil);

        let clientesAtendidos = 0;
        let perdidosPorPreco = 0;
        let perdidosPoerEstoque = 0;
        let receita = 0;
        let somaSatisfacao = 0;

        for (let i = 0; i < atendidosAlvo; i++){
            const perfil = this.sortearPerfil();
            const escolha = perfil.escolher(entrada.cardapio, this.sorteador);

            if (!escolha){
                perdidosPorPreco++;
                continue;
            }

            const receitaItem: Receita = escolha.receita;
            if (!entrada.reserva.temPara(receitaItem)){
                perdidosPorEstoque++;
                continue;
            }

            conts qualidade = entrada.reserva.consumir(receitaItem);
            const preco = escolha.gerPreco();
            const nota = perfil.satisfacao(preco, qualidade, this.sorteador);

            clientesAtendidos++;
            receita += preco;
            somaSatisfacao += nota;
        }

        const satisfacaoMedia = clientesAtendidos > 0 ? Math.round(somaSatisfacao / clientesAtendidos) : 50;

        return{
            clientesAtendidos, perdidosPorPreco, perdidosPrEstoque, perdidosPorAtendimento, receita, satisfacaoMedia
        };
    }
}
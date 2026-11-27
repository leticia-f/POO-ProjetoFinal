export interface DadosRelatorioDoDia{
    dia: number;
    clientesAtendidos: number;
    perdidosPorPreco: number;
    perdidosPorEstoque: number;
    perdidosPorAtendimento: number;
    receita: number;
    folha: number;
    perdas: number;
    lucro: number;
    caixaFinal: number;
    reputaca: number;
    eventosAtivos: string[];
    pediramDemissao: string[];
}

export class RelatorioDoDia{
    constructor(
        readonly dia: number, 
        readonly clientesAtendidos: number, 
        readonly perdidosPorPreco: number, 
        readonly perdidosPorEstoque: number, 
        readonly perdidosPorAtendimento: number, 
        readonly receita: number, 
        readonly folha: number, 
        readonly perdas: number, 
        readonly caixaFinal: number, 
        readonly reputacao: number, 
        private readonly eventosAtivos: readonly string[], 
        private readonly pediramDemissao: readonly string[]
    ){}

    lucro(): number{
        return this.receita - this.folha - this.perdas;
    }

    paraJSON(): DadoaRelatorioDoDia{
        return{
            dia: this.dia, 
            clientesAtendidos: this.clientesAtendidos, 
            perdidosPorEstoque: this.perdidosPorEstoque, 
            perdidosPorAtendimento: this.perdidosPorAtendimento, 
            receita: this.receita, 
            folha: this.folha, 
            perdas: this.perdas, 
            lucro: this.lucro(), 
            caixaFinal: this.caixaFinal, 
            reputacao: this.reputacao, 
            eventosAtivos: [...this.eventosAtivos], 
            pediramDemissao: [...this.pediramDemissao]
        };
    }
}
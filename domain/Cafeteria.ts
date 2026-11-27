import { RelatorioDoDia } from "./RelatorioDoDia.ts";
import { SimuladorDoDia } from "./SimuladorDoDia.ts";
import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";
import type { Evento } from "./Evento.ts";
import type { Sorteador } from "./Sorteador.ts";
import type { Estoque } form "./Estoque.ts";
import type { GerenteDeCompras } from "./GerenteDeCompras.ts";
import type { Cardapio } from "./Cardapio.ts";
import type { Equipe } from "./Equipe.ts";
import type { EventoFactory } form "./EventoFactory.ts";
import type { CondicaoDeFim, EstadoParaFim, Situacao } from "./CondicaoDeFim.ts";

export interface DependenciasCafeterio{
    estoque: Estoque;
    gerenteDeCompras: GerenteDeCompras;
    cardapio: Cardapio;
    equipe: Equipe;
    fabricaDeEventos: EventoFactory;
    sorteador: Sorteador;
    condicoesDeFim?: readonly CondicaoDeFim[];
    caixaInicial?: number;
    reputacaoInicial?: number;
    demandaBasa?: number;
}

export class Cafeteria{
    private dia = 1;
    private caixa: number;
    private reputacao: number;
    private diasComCaixaNegativo = 0;
    private situacao: Situacao = "em-andamento";
    private readonly demandaBase: number;
    private readonly relatorios: RelatorioDoDia[] = [];
    private readonly simulador: SimuladorDoDia;
    private readonly condicoesDeFim: readonly CondicoesDeFim[]

    readonly estoque: Estoque;
    readonly gerenteDeCompras: GerenteDeCompras;
    readonly cardapio: Cardapio;
    readonly equipe: Equipe;
    readonly fabricaDeEventos: EventoFactory;
    readonly sorteador: Sorteador;

    constructor(dep: DependenciasDaCafeteria){
        this.estoque = dep.estoque;
        this.gerenteDeCompras = dep.gerenteDeCompras;
        this.cardapio = dep.cardapio;
        this.equipe = dep.equipe;
        this.sorteador = dep.sorteador;

        this.caixa = dep.caixaInicial ?? 300000;
        this.reputacao = dep.reputacaoInicial ?? 50;
        this.demandaBase = dep.demandaBase ?? 50;
        this.condicoesDeFim = dep.condicoesDeFim ?? [];
        this.simulador = new SimuladorDoDia(this.sorteador);
    }

    getDia(): number{
        return this.dia;
    }
    getCaixa(): number{
        return this.caixa;
    }
    getReputacao(): number{
        return this.reputacao;
    }
    getSituacao(): Situacao{
        return this.situacao;
    }
    getEstoque(): Estoque{
        return this.estoque;
    }
    getGerenteDeCompras(): GerenteDeCompras{
        return this.gerenteDeCompras;
    }
    getCardapio(): Cardapio{
        return this.cardapio;
    }
    getEquipe(): Equipe{
        return this.equipe;
    }
    listarEventosAtivos(): reaadonly Evento[]{
        return [...this.eventos];
    }
    listarRelatorios(): readonly RelatorioDoDia[]{
        return [...this.relatorios];
    }
    receber(valor: number): void{
        this.caixa += valor;
    }
    pagar(valor: number): void{
        if  (valor > this.caixa){
            throw new Error("Caixa insuficiente");
        }
        this.caixa -= valor;
    }

    debitarDespesa(valor: number): void {
    this.caixa -= valor;
  }

  multiplicadorDeCusto(): number {
    return this.eventos.reduce(
      (total, evento) => total * evento.multiplicadorDeCusto(),
      1,
    );
  }

  multiplicadorDeDemanda(): number {
    return this.eventos.reduce(
      (total, evento) => total * evento.multiplicadorDeDemanda(),
      1,
    );
  }

  comprar(fornecedor: string, ingrediente: string, quantidade: number): number {
    if (this.situacao !== "em-andamento") {
      throw new Error("O jogo terminou.");
    }
    const custo = this.gerenteDeCompras.orcar(
      fornecedor,
      ingrediente,
      quantidade,
      this.multiplicadorDeCusto(),
    );
    this.pagar(custo);
    this.gerenteDeCompras.comprar(
      fornecedor,
      ingrediente,
      quantidade,
      this.multiplicadorDeCusto(),
    );
    return custo;
  }

  novoDia(): RelatorioDoDia {
    if (this.situacao !== "em-andamento") {
      throw new Error("O jogo terminou.");
    }

    for (const evento of this.eventos) {
      evento.novoDia();
    }
    for (let i = this.eventos.length - 1; i >= 0; i--) {
      if (this.eventos[i].terminou()) {
        this.eventos.splice(i, 1);
      }
    }
    const novoEvento = this.fabricaDeEventos.sortear(
      this.sorteador,
      this.eventos,
    );
    if (novoEvento) {
      this.eventos.push(novoEvento);
    }

    this.gerenteDeCompras.novoDia();

    const resultado = this.simulador.simular({
      cardapio: this.cardapio.listar(),
      reserva: this.estoque,
      capacidade: this.equipe.capacidadeDeAtendimento(),
      demandaBase: this.demandaBase,
      reputacao: this.reputacao,
      multiplicadorDeDemanda: this.multiplicadorDeDemanda(),
    });

    this.receber(resultado.receita);

    const folha = this.equipe.folhaDoDia();
    this.debitarDespesa(folha);

    const equipeComDemissoes = this.equipe as Equipe & {
      novoDia(): void;
      pediramDemissaoNoDia?: () => readonly string[];
    };
    equipeComDemissoes.novoDia();
    const pediramDemissao = equipeComDemissoes.pediramDemissaoNoDia
      ? [...equipeComDemissoes.pediramDemissaoNoDia()]
      : [];

    (this.estoque as AtualizavelPorDia).novoDia();
    const perdas = this.estoque.valorPerdidoNoDia();

    const variacaoReputacao =
      Math.round((resultado.satisfacaoMedia - 50) / 10) -
      Math.floor(resultado.perdidosPorEstoque / 10);
    this.reputacao = Math.max(
      0,
      Math.min(100, this.reputacao + variacaoReputacao),
    );

    const relatorio = new RelatorioDoDia(
      this.dia,
      resultado.clientesAtendidos,
      resultado.perdidosPorPreco,
      resultado.perdidosPorEstoque,
      resultado.perdidosPorAtendimento,
      resultado.receita,
      folha,
      perdas,
      this.caixa,
      this.reputacao,
      this.eventos.map((ev) => ev.nome),
      pediramDemissao,
    );

    this.relatorios.push(relatorio);
    this.dia += 1;

    this.diasComCaixaNegativo = this.caixa < 0
      ? this.diasComCaixaNegativo + 1
      : 0;

    const estadoFim: EstadoParaFim = {
      caixa: this.caixa,
      diasComCaixaNegativo: this.diasComCaixaNegativo,
    };
    for (const condicao of this.condicoesDeFim) {
      const avaliacao = condicao.avaliar(estadoFim);
      if (avaliacao === "vitoria" || avaliacao === "derrota") {
        this.situacao = avaliacao;
        break;
      }
    }

    return relatorio;
  }

  paraJSON() {
    const ultimoRelatorio = this.relatorios.length > 0
      ? this.relatorios[this.relatorios.length - 1].paraJSON()
      : null;

    return {
      dia: this.dia,
      caixa: this.caixa,
      reputacao: this.reputacao,
      situacao: this.situacao,
      diasComCaixaNegativo: this.diasComCaixaNegativo,
      eventosAtivos: this.eventos.map((evento) => evento.nome),
      ultimoRelatorio,
      relatorios: this.relatorios.map((r) => r.paraJSON()),
    };
  }
}
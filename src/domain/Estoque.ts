import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";
import type { Receita } from "./Receita.ts";
import type { ReservaDeIngredientes } from "./ReservaDeIngredientes.ts";
import { LoteDeIngrediente } from "./LoteDeIngrediente.ts";
import type { LoteJSON } from "./LoteDeIngrediente.ts";

export interface EstoqueJSON {
  lotes: LoteJSON[];
  perdasDoDia: number;
}

export class Estoque implements ReservaDeIngredientes, AtualizavelPorDia {
  private lotes: LoteDeIngrediente[] = [];
  private perdasDoDia = 0;

  adicionarLote(lote: LoteDeIngrediente): void {
    this.lotes.push(lote);
  }

  quantidadeDe(ingrediente: string): number {
    return this.lotes
      .filter((lote) => lote.getIngrediente() === ingrediente)
      .reduce((total, lote) => total + lote.getQuantidade(), 0);
  }

  temPara(receita: Receita): boolean {
    for (const [ingrediente, qtdNecessaria] of Object.entries(receita)) {
      if (this.quantidadeDe(ingrediente) < qtdNecessaria) {
        return false;
      }
    }
    return true;
  }

  consumir(receita: Receita): number {
    if (!this.temPara(receita)) {
      throw new Error("Ingredientes insuficientes no estoque.");
    }

    let somaQualidadePonderada = 0;
    let totalDosesConsumidas = 0;

    for (const [ingrediente, qtdNecessaria] of Object.entries(receita)) {
      let restante = qtdNecessaria;

      const lotesDoIngrediente = this.lotes
        .filter((lote) => lote.getIngrediente() === ingrediente && !lote.estaVazio())
        .sort((a, b) => a.getDiasParaVencer() - b.getDiasParaVencer());

      for (const lote of lotesDoIngrediente) {
        if (restante <= 0) break;

        const retirarAgora = Math.min(restante, lote.getQuantidade());
        lote.retirar(retirarAgora);

        somaQualidadePonderada += retirarAgora * lote.getQualidade();
        totalDosesConsumidas += retirarAgora;
        restante -= retirarAgora;
      }
    }

    this.lotes = this.lotes.filter((lote) => !lote.estaVazio());

    if (totalDosesConsumidas === 0) return 0;
    return somaQualidadePonderada / totalDosesConsumidas;
  }

  novoDia(): void {
    this.perdasDoDia = 0;

    for (const lote of this.lotes) {
      lote.novoDia();
      if (lote.venceu()) {
        this.perdasDoDia += lote.getQuantidade() * lote.getCustoUnitario();
      }
    }

    this.lotes = this.lotes.filter((lote) => !lote.venceu());
  }

  valorPerdidoNoDia(): number {
    return this.perdasDoDia;
  }

  custoMedio(ingrediente: string): number {
    const lotesDoIngrediente = this.lotes.filter(
      (lote) => lote.getIngrediente() === ingrediente && !lote.estaVazio(),
    );

    if (lotesDoIngrediente.length === 0) {
      return 0;
    }

    let custoTotal = 0;
    let quantidadeTotal = 0;

    for (const lote of lotesDoIngrediente) {
      custoTotal += lote.getQuantidade() * lote.getCustoUnitario();
      quantidadeTotal += lote.getQuantidade();
    }

    return Math.round(custoTotal / quantidadeTotal);
  }

  listarLotes(): readonly LoteDeIngrediente[] {
    return [...this.lotes];
  }

  paraJSON(): EstoqueJSON {
    return {
      lotes: this.lotes.map((lote) => lote.paraJSON()),
      perdasDoDia: this.perdasDoDia,
    };
  }

  restaurarEstado(dados: EstoqueJSON): void {
    this.lotes = (dados.lotes ?? []).map((loteJson) =>
      LoteDeIngrediente.restaurarEstado(loteJson)
    );
    this.perdasDoDia = dados.perdasDoDia ?? 0;
  }
}
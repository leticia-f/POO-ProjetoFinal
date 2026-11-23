import { Evento, DiaDeChuva, Festival, GreveFornecedores } from "./Eventos.ts";
import type { Sorteador } from "./Sorteador.ts";

const CHANCE_EVENTO_DIA = 0.2;

export class GeradorEventos {
  private readonly criadores: (() => Evento)[] = [
    () => new DiaDeChuva(),
    () => new GreveFornecedores(),
    () => new Festival(),
  ];

  // com 20% de chance devolve um evento novo (entre os tipos que ainda não estão ativos)
  sortear(sorteador: Sorteador, ativos: readonly Evento[]): Evento | undefined {
    if (sorteador.proximo() >= CHANCE_EVENTO_DIA) return undefined;

    const candidatos = this.criadores.map((criar) => criar())
      .filter((evento) => !ativos.some((ativo) => ativo.nome === evento.nome));

    if (candidatos.length === 0) return undefined;

    return candidatos[Math.floor(sorteador.proximo() * candidatos.length)];
  }

  // recria um evento salvo com os dias que ainda faltavam
  restaurar(nome: string, diasRestantes: number): Evento {
    if (!Number.isInteger(diasRestantes) || diasRestantes < 0) {
      throw new Error("Dias restantes inválidos para restaurar o evento.");
    }
    
    switch (nome) {
      case "Dia de chuva":
        return new DiaDeChuva(diasRestantes);
      case "Greve de fornecedores":
        return new GreveFornecedores(diasRestantes);
      case "Festival na cidade":
        return new Festival(diasRestantes);
      default:
        throw new Error(`Evento desconhecido: ${nome}.`);
    }
  }
}

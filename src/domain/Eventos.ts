import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";

export interface Evento extends AtualizavelPorDia {
  readonly nome: string;

  terminou(): boolean;
  multiplicadorDeDemanda(): number; // 1 = não altera
  multiplicadorDeCusto(): number; // 1 = não altera
}

// ======= TIPOS DE EVENTO =======

export class DiaDeChuva implements Evento {
  readonly nome = "Dia de chuva";

  constructor(private diasRestantes = 2) {}

  novoDia() {
    this.diasRestantes--;
  }

  terminou(): boolean {
    return this.diasRestantes <= 0;
  }

  multiplicadorDeDemanda(): number {
    return 0.7;
  }

  multiplicadorDeCusto(): number {
    return 1;
  }

  paraJSON() {
    return { nome: this.nome, diasRestantes: this.diasRestantes };
  }
}

export class GreveFornecedores implements Evento {
  readonly nome = "Greve de fornecedores";

  constructor(private diasRestantes = 3) {}

  novoDia() {
    this.diasRestantes--;
  }

  terminou(): boolean {
    return this.diasRestantes <= 0;
  }

  multiplicadorDeDemanda(): number {
    return 1;
  }

  multiplicadorDeCusto(): number {
    return 1.5;
  }

  paraJSON() {
    return { nome: this.nome, diasRestantes: this.diasRestantes };
  }
}

export class Festival implements Evento {
  readonly nome = "Festival na cidade";

  constructor(private diasRestantes = 1) {}

  novoDia() {
    this.diasRestantes--;
  }

  terminou(): boolean {
    return this.diasRestantes <= 0;
  }

  multiplicadorDeDemanda(): number {
    return 1.5;
  }

  multiplicadorDeCusto(): number {
    return 1;
  }

  paraJSON() {
    return { nome: this.nome, diasRestantes: this.diasRestantes };
  }
}
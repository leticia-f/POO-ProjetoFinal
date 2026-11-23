import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";

export abstract class Funcionario implements AtualizavelPorDia {
  private salario = 0; // por dia, em centavos
  private diasInsatisfeito = 0;

  abstract readonly funcao: string;

  constructor(public readonly nome: string, salario: number) {
    if (nome.trim() === "") {
      throw new Error("O funcionário precisa de um nome.");
    }

    this.definirSalario(salario);
  }

  abstract salarioDeMercado(): number;
  abstract capacidadeBase(): number;

  getSalario(): number {
    return this.salario;
  }

  getDiasInsatisfeito(): number {
    return this.diasInsatisfeito;
  }

  definirSalario(salario: number) {
    if (!Number.isInteger(salario) || salario <= 0) {
      throw new Error("O salário deve ser um inteiro positivo (em centavos).");
    }
    this.salario = salario;
  }

  // satisfação do funcionário com o salário:
  // 0 = muito insatisfeito; 50 = satisfeito (= salário de mercado); 100 = muito satisfeito
  satisfacao(): number {
    const razao = this.salario / this.salarioDeMercado();
    const nota = Math.round(50 + (razao - 1) * 100);
    return Math.max(0, Math.min(100, nota));
  }

  // satisfação maior = capacidade de atendimento maior
  // 50 = 1; 100 = 1,5; 0 = 0,5
  capacidadeDeAtendimento(): number { 
    return Math.round(this.capacidadeBase() * (0.5 + this.satisfacao() / 100));
  }

  novoDia() {
    if (this.satisfacao() < 20) this.diasInsatisfeito++;
    else this.diasInsatisfeito = 0;
  }

  pediuDemissao(): boolean { // insatisfeito há 3 dias consecutivos = pede demissão
    return this.diasInsatisfeito >= 3;
  }

  restaurarEstado(salario: number, diasInsatisfeito: number) { // restaura o estado do funcionário (para testes)
    if (!Number.isInteger(diasInsatisfeito) || diasInsatisfeito < 0) {
      throw new Error("Dias de insatisfação inválidos para restaurar o funcionário.");
    }
    this.definirSalario(salario);
    this.diasInsatisfeito = diasInsatisfeito;
  }

  paraJSON() {
    return {
      nome: this.nome,
      funcao: this.funcao,
      salario: this.salario,
      salarioDeMercado: this.salarioDeMercado(),
      satisfacao: this.satisfacao(),
      capacidade: this.capacidadeDeAtendimento(),
      diasInsatisfeito: this.diasInsatisfeito,
      pediuDemissao: this.pediuDemissao(),
    };
  }
}

// ======= TIPOS DE FUNCIONÁRIO =======

const SALARIO_MERCADO_ATENDENTE = 6000; // R$ 60,00 por dia
const CAPACIDADE_BASE_ATENDENTE = 25; // clientes por dia

export class Atendente extends Funcionario {
  readonly funcao = "atendente";

  constructor(nome: string, salario = SALARIO_MERCADO_ATENDENTE) {
    super(nome, salario);
  }

  salarioDeMercado(): number {
    return SALARIO_MERCADO_ATENDENTE;
  }

  capacidadeBase(): number {
    return CAPACIDADE_BASE_ATENDENTE;
  }
}

const SALARIO_MERCADO_BARISTA = 8000; // R$ 80,00 por dia
const CAPACIDADE_BASE_BARISTA = 30; // clientes por dia

export class Barista extends Funcionario {
  readonly funcao = "barista";

  constructor(nome: string, salario = SALARIO_MERCADO_BARISTA) {
    super(nome, salario);
  }

  salarioDeMercado(): number {
    return SALARIO_MERCADO_BARISTA;
  }

  capacidadeBase(): number {
    return CAPACIDADE_BASE_BARISTA;
  }
}
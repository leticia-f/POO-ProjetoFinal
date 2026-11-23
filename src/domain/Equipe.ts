import type { AtualizavelPorDia } from "./AtualizavelPorDia.ts";
import type { Funcionario } from "./Funcionarios.ts";

export interface ForcaDeTrabalho {
  capacidadeDeAtendimento(): number; // clientes por dia
  folhaDoDia(): number; // soma dos salários diários, em centavos
}

const NUM_MAX_FUNCIONARIOS = 6;

export class Equipe implements ForcaDeTrabalho, AtualizavelPorDia {
  private readonly funcionarios: Funcionario[] = [];
  private demitidosNoDia: string[] = [];

  contratar(funcionario: Funcionario) {
    if (this.funcionarios.length >= NUM_MAX_FUNCIONARIOS) {
      throw new Error(`A equipe já tem o máximo de ${NUM_MAX_FUNCIONARIOS} funcionários.`);
    }
    if (this.encontrar(funcionario.nome)) {
      throw new Error(`Já existe um funcionário chamado ${funcionario.nome}.`);
    }
    this.funcionarios.push(funcionario);
  }

  demitir(nome: string) {
    const indice = this.funcionarios.findIndex((f) => this.mesmoNome(f, nome));
    if (indice === -1) {
      throw new Error(`Não existe funcionário chamado ${nome}.`);
    }
    this.funcionarios.splice(indice, 1);
  }

  encontrar(nome: string): Funcionario | undefined {
    return this.funcionarios.find((f) => this.mesmoNome(f, nome));
  }

  listar(): readonly Funcionario[] {
    return [...this.funcionarios];
  }

  capacidadeDeAtendimento(): number {
    return this.funcionarios.reduce((total, f) => total + f.capacidadeDeAtendimento(), 0);
  }

  folhaDoDia(): number {
    return this.funcionarios.reduce((total, f) => total + f.getSalario(), 0);
  }

  novoDia() {
    this.demitidosNoDia = [];

    for (const funcionario of this.funcionarios) {
      funcionario.novoDia();
    }

    for (const funcionario of this.funcionarios.filter((f) => f.pediuDemissao())) {
      this.demitidosNoDia.push(funcionario.nome);
      this.demitir(funcionario.nome);
    }
  }

  pediramDemissaoNoDia(): readonly string[] { // quem pediu demissão no último novoDia()
    return [...this.demitidosNoDia];
  }

  restaurarEstado(funcionarios: readonly Funcionario[]) {
    const nova = new Equipe();

    for (const funcionario of funcionarios) {
      nova.contratar(funcionario);
    }

    this.funcionarios.length = 0;
    this.funcionarios.push(...nova.funcionarios);
    this.demitidosNoDia = [];
  }

  paraJSON() {
    return {
      funcionarios: this.funcionarios.map((f) => f.paraJSON()),
      capacidade: this.capacidadeDeAtendimento(),
      folha: this.folhaDoDia(),
    };
  }

  private mesmoNome(funcionario: Funcionario, nome: string): boolean {
    return funcionario.nome.toLocaleLowerCase() === nome.toLocaleLowerCase();
  }
}
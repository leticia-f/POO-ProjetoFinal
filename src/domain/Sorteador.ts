// retorna número de 0 (incluso) até 1 (excluído) como Math.random()
export interface Sorteador {
  proximo(): number;
}

export class SorteadorAleatorio implements Sorteador {
  proximo(): number {
    return Math.random();
  }
}

// para testes: a mesma semente sempre gera a mesma sequência.
export class SorteadorComSemente implements Sorteador {
  constructor(private estado: number) {}

  proximo(): number {
    this.estado = (this.estado + 0x6d2b79f5) | 0;
    let t = Math.imul(this.estado ^ (this.estado >>> 15), 1 | this.estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
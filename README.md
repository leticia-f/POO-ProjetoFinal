# ☕ Café Tycoon

Um jogo de gestão por turnos (dias) em que o jogador administra uma cafeteria. O programa permite comprar ingredientes, definir preços do cardápio e contratar funcionários, enquanto simula a clientela de cada dia e eventos que afetam vendas e custos.

Projeto final de Programação Orientada a Objetos (POO), feito em TypeScript com backend em Deno + Express e frontend em React + Vite. Em desenvolvimento.

## 1. Tecnologias

- **Linguagem:** TypeScript
- **Backend:** Deno + Express 5
- **Testes:** `deno test` com a biblioteca `@std/assert`
- **Frontend:** React + Vite (planejado)
- **Persistência:** padrão Repository com arquivo JSON e Prisma + SQLite (planejado)

## 2. Fluxo de Git

Sempre fazer atualizações em branches, nunca na main.
Uma branch por tarefa, com nome no formato `prefixo/assunto`, por exemplo `feat/rotas-produtos` ou `fix/estoques`.

Prefixo | Situação
--- | ---
`feat` | Funcionalidade nova
`fix` | Correção
`test` | Testes
`doc` | Documentação

### Passo a passo de uma tarefa (exemplo)

```bash
git checkout main
git pull
git checkout -b feat/equipe-e-eventos

# trabalhe e teste
deno test
deno check src/main.ts

git add .
git commit -m "feat: adiciona Equipe e eventos"
git push -u origin feat/equipe-e-eventos
```

Depois abra o pull request no GitHub, peça a revisão e faça o merge quando for aprovado. Em seguida, volte à `main` e rode `git pull` antes da próxima tarefa.

## 3. Testes

Os testes ficam na pasta `tests/` e usam o executor de testes do próprio Deno (`Deno.test`) com as funções de `@std/assert`. Cada arquivo cobre uma parte do domínio:

| Arquivo | O que testa |
| --- | --- |
| `tests/estoque.test.ts` | Estoque, lotes, fornecedores e compras |
| `tests/equipe.test.ts` | Satisfação, capacidade, demissão e limites da equipe |
| `tests/eventos.test.ts` | Duração e efeito dos eventos, sorteio e restauração |

Na raiz do projeto, para rodar todos os testes:

```bash
deno task test
```

Para rodar só um arquivo (troque pelo nome):

```bash
deno test --allow-read --allow-write tests/equipe.test.ts
```

Para rodar só os testes cujo nome contém um trecho (entre aspas):

```bash
deno test --allow-read --allow-write --filter "demissão"
```

Cada teste mostra `ok` ou `FAILED`, e no fim aparece o total (`N passed | 0 failed`). 
Também vale rodar `deno fmt` (formata o código) e `deno lint` (avisos).

Na primeira execução o Deno baixa a biblioteca `@std/assert`, então é preciso estar conectado à internet.

## 4. Como executar

### Pré-requisitos

- [Deno](https://deno.com) instalado (`npm install -g --allow-scripts=deno deno`)
> Ainda não houve implementação do frontend.

### (i) Backend

Na raiz do projeto:

```bash
deno task dev
```
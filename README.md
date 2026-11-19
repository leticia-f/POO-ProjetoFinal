# ☕ Café Tycoon

Um jogo de gestão por turnos (dias) em que o jogador administra uma cafeteria. O programa permite comprar ingredientes, definir preços do cardápio e contratar funcionários, enquanto simula a clientela de cada dia e eventos que afetam vendas e custos.

Projeto final de Programação Orientada a Objetos (POO), feito em TypeScript com backend em Deno + Express e frontend em React + Vite. Em desenvolvimento.

## Tecnologias

- **Linguagem:** TypeScript
- **Backend:** Deno + Express 5
- **Frontend:** React + Vite (planejado)
- **Persistência:** padrão Repository com arquivo JSON e Prisma + SQLite (planejado)

## Fluxo de Git

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
git checkout -b semana1/equipe-e-eventos

# trabalhe e teste
deno test
deno check src/main.ts

git add .
git commit -m "feat: adiciona Equipe e eventos"
git push -u origin semana1/equipe-e-eventos
```

Depois abra o pull request no GitHub, peça a revisão e faça o merge quando for aprovado. Em seguida, volte à `main` e rode `git pull` antes da próxima tarefa.

## Como executar

### Pré-requisitos

- [Deno](https://deno.com) instalado (`npm install -g --allow-scripts=deno deno`)
> Ainda não houve implementação do frontend.

### 1. Backend

Na raiz do projeto:

```bash
deno task dev
```
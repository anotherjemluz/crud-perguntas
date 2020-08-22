# Crud Perguntas

Uma aplicação simples usando JS (Vue, Node) e Psql, com TDD.

## Backend
#### Rodando 

Você vai precisar do node, npm e knex instalados globalmente(declarados nas variáveis de ambiente) na sua máquina.
E também do postgresql.

```
1. (terminal) cd back
2. (terminal) npm i
```

3. enquanto o npm instala as dependencias, crie uma tabela vazia no PostGreSQL com o nome 'quiz'
> Você pode configurar a integração do banco no [knexfile.js](https://github.com/jemluz/crud-perguntas/blob/master/back/knexfile.js)

Após concluir a instalação das dependencias, é possível testar a api com:
```
4. (terminal) npm run safe
```
 Para usar com o frontend, ou realizar testes manuais:
```
5. (terminal) npm start
```

## Frontend
#### Rodando 

Você vai precisar do node e npm instalados globalmente(declarados nas variáveis de ambiente) na sua máquina.

```
1. (terminal) cd front
2. (terminal) npm i
3. (terminal) npm run serve
```
4. certifique-se de ter feito rodado o ```npm start``` na pasta do backend
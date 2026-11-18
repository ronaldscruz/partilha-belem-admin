# Partilha Belém Admin

MVP acadêmico em Angular 21 para registrar campanhas e estoque e estimar quantas ações têm kits completos.

## Executar

Com Node.js 24 e npm, nesta pasta:

```sh
npm ci
npm start
```

Abra http://localhost:4200. Se a porta estiver ocupada, use `npm start -- --port 4201`.

Use `npm run build` para gerar os arquivos de publicação e `npm test` para testar o cálculo de kits e a alocação por campanha.

Para conferir o fluxo com dados de exemplo, siga o [roteiro de validação](docs/validacao-tecnica.md).

Esta primeira versão salva os dados no navegador. A integração com Supabase e o login dos voluntários ainda serão implementados.

# Estrutura do MVP

- `src/app/app.ts` e `src/app/app.html` implementam o menu, os cadastros e a consulta de cobertura.
- `src/app/planning.ts` calcula quantos kits completos o estoque permite montar. A cobertura é calculada por data e desconta a demanda de cada campanha coberta.
- `tests/` contém os testes de capacidade e cobertura. O GitHub Actions executa os testes e o build.

Nesta versão, os cadastros ficam no armazenamento local do navegador.

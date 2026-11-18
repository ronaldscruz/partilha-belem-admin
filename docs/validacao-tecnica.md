# Validação técnica

Use dados de demonstração. Na tela Cadastros, salve 12 sanduíches de carne, 4 de queijo, 16 águas e 16 outras bebidas. Cadastre duas campanhas, uma em 21/11/2026 para 10 pessoas e outra em 28/11/2026 para 8 pessoas. Use 60 minutos de duração em ambas.

Abra Cobertura. O saldo permite 16 kits completos. A primeira campanha deve aparecer como coberta. A segunda deve ficar sem cobertura, pois restam 6 kits após reservar 10 para a primeira.

Recarregue a página e volte para Cobertura. Os registros devem continuar disponíveis no mesmo navegador. Para conferir a validação do formulário, deixe um campo obrigatório vazio e verifique se o salvamento permanece desabilitado.

Para a verificação automatizada, execute `npm ci`, `npm test` e `npm run build`.

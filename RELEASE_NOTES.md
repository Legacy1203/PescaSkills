# PescaSkills v1.0.3 — 22 de outubro de 2026

- Consultas ao Twish no processo de segundo plano, agendadas aproximadamente a cada 30 segundos enquanto houver uma aba do CasalSkills no Twish aberta.
- Histórico de hoje na aba Eventos: nome, horário de detecção em Brasília, andamento e encerramento confirmado; persistência local e deduplicação.
- Registro de eventos regulares e grandes eventos simultâneos, sem recuperar períodos não acompanhados.
- Dados antigos descartados ao iniciar uma nova sessão; resposta atrasada e aba antiga não sobrescrevem informações mais recentes.
- Contadores calculados por horário absoluto; seletores verificam a validade de cada conjunto de dados.
- Histórico e notificações preservados; nova sincronização após lacunas longas não dispara avisos antigos.
- Novas permissões: alarms e acesso apenas ao host https://twish.com.br/*.

Após atualizar, recarregue a extensão e as páginas da Twitch e do Twish. Mantenha o Twish do CasalSkills aberto e conectado. O agendamento pode atrasar conforme o navegador e a suspensão do computador.

[Baixar o pacote aprovado 1.0.3](releases/PescaSkills-v1.0.3.zip)

## Histórico de versões anteriores

# Atualização aprovada — 9 de outubro de 2026

- Logos com transparência; arte em pixel art no Tema Clássico.
- Versão exibida em todas as abas do menu.
- Atalhos organizáveis por arrastar, com menu fixo.
- Eventos compactos e descrição ao passar o mouse, sem repetir nome ou tempo.
- Progresso real do Barco Misterioso abaixo do nome, atualizado pela API a cada 15 segundos durante a arrecadação.
- Novos sons de pesca disponível e eventos, controles separados e volumes inteiros de 1 a 10.
- Testar som e botões Ligado/Desligado.
- Seleção de tema por dropdown.
- Arremesso automático opcional: envia $pescar somente ao clicar no atalho rápido.
- Notificações do computador com controles independentes, desligadas por padrão e sem repetição nas atualizações do estado.

Após atualizar a extensão, recarregue Twitch e Twish. As notificações dependem das permissões do navegador e das configurações do sistema.

## Histórico anterior

## 🚀 Novas entregas

Esta atualização expande o PescaSkills para além dos atalhos de comandos, trazendo integração mais inteligente com os dados e estados do Twish.

### 🎣 Pesca inteligente

- Detecção automática do cooldown de pesca.
- Contagem regressiva em tempo real.
- Bloqueio do botão enquanto a pesca estiver indisponível.
- Indicação automática quando uma nova pesca estiver disponível.

### ⚡ Eventos em tempo real

- Detecção automática de eventos ativos no Twish.
- Card de evento diretamente acima dos atalhos.
- Nome, descrição e tempo restante do evento.
- Destaque visual do atalho de Evento enquanto estiver ativo.

### 👤 Busca de jogadores

- Busca e seleção de jogadores nos comandos que exigem um usuário como complemento.
- Montagem automática do comando após a seleção.
- Opção de preenchimento manual mantida.

### 🎒 Seletores inteligentes

Novos seletores integrados aos dados reais do Twish para:

- 🪱 **Iscas:** exibe as iscas disponíveis e suas quantidades.
- 🐟 **Venda:** lista os peixes presentes no inventário e permite escolher a quantidade.
- 🏷️ **Títulos:** exibe os títulos desbloqueados e identifica o atualmente equipado.
- 🛒 **Comprar:** utiliza os itens e informações disponíveis na loja do Twish.

### ✨ Nova interface dos seletores

- Cards mais organizados e integrados ao Tema Skills.
- Busca aprimorada.
- Controles de quantidade `− / +`.
- Ações contextuais: **Usar, Vender, Comprar e Equipar**.
- Melhor organização de nomes, descrições, quantidades, preços e informações adicionais.
- Opção **Digitar manualmente** preservada.

### 🛠️ Melhorias gerais

- `Alias` renomeado para **Atalho**.
- Versão instalada exibida automaticamente em Ajustes.
- Correções de interface e consistência dos comandos.
- Melhor integração visual com a identidade do PescaSkills.
- Os comandos continuam sendo preparados no chat para confirmação manual antes do envio.

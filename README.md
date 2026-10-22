# 🎣 PescaSkills

Extensão para **Chrome e Microsoft Edge** criada para facilitar o uso dos comandos de pesca do Twish diretamente no chat da Twitch.

O **PescaSkills v1.0.3** adiciona uma barra de atalhos ao chat e um menu flutuante com comandos organizados por categoria.

## 🚀 Novas entregas

A versão 1.0.3 inclui histórico diário dos eventos acompanhados pela extensão e consultas ao Twish pelo processo de segundo plano. Também corrige dados antigos após reabrir o navegador, conflitos entre abas e respostas atrasadas. O envio é manual por padrão; o Arremesso automático opcional envia apenas $pescar quando o usuário clica no atalho rápido e a disponibilidade está confirmada.

Confira a descrição completa em [Novas entregas](RELEASE_NOTES.md) e baixe o [pacote aprovado](releases/PescaSkills-v1.0.3.zip).

## ✨ Principais recursos

- 🎣 Comandos do Twish organizados por categoria
- ⭐ Até **6 atalhos rápidos personalizáveis**
- 💾 Atalhos salvos automaticamente no navegador
- 🎮 Interface integrada à Twitch
- 🔗 Acesso direto a Inventário, Loja e Comandos
- 💬 Preenchimento dos comandos diretamente no chat
- ⚙️ Menu **Ajustes**
- 🎨 **Tema Skills** e **Tema Clássico**, com preferência salva no navegador
- 🔊 Alertas de pesca e eventos, com volumes inteiros de 1 a 10
- 🔔 Notificações do computador, com controles separados de pesca e eventos
- 🚢 Progresso do Barco Misterioso consultado pela API em intervalos de aproximadamente 30 segundos
- 📜 Histórico de hoje na aba Eventos, com horário de detecção em Brasília e estado confirmado
- 🔄 Sincronização em segundo plano, sem depender dos temporizadores da aba
- 🖱️ Organização dos atalhos por arrastar, mantendo o menu fixo
- 🎣 Arremesso automático opcional ao clicar no atalho de pesca

## 🎨 Temas

Abra o menu `≡` e acesse **⚙ Ajustes** para trocar a aparência da extensão pelo menu de seleção de tema.

- **Tema Skills** — visual escuro com roxo neon e detalhes em azul. É o tema padrão.
- **Tema Clássico** — visual original marrom e bege da extensão.

A troca é aplicada imediatamente e a preferência permanece salva no navegador.

## 🎮 Menu de comandos

Os comandos são separados em categorias:

- 👤 Jogador
- 🎣 Pesca
- ⚔ Duelos
- 🎪 Eventos
- 🏆 Rankings
- 🎒 Loja
- ❓ Ajuda
- ⚙ Ajustes

Ao clicar em um comando de chat, a extensão preenche o campo de mensagem da Twitch. Por padrão, o usuário pressiona Enter. Ao ativar **Arremesso automático** em Ajustes, um clique no atalho rápido envia $pescar quando a disponibilidade da pesca está confirmada. Os demais comandos permanecem manuais.

## ⭐ Barra de atalhos personalizável

Você pode escolher até **6 comandos** para deixar disponíveis diretamente na barra rápida. Use `☆` para adicionar e `★` para remover um atalho. O contador mostra os espaços utilizados (`Atalhos X/6`).

Clique e arraste os atalhos para organizar suas posições. As preferências são armazenadas localmente no navegador. O botão `≡` fica sempre disponível e não ocupa um dos seis espaços personalizáveis.

## 📜 Histórico e sincronização

O histórico mostra os eventos detectados no dia, com os mais recentes primeiro. O horário exibido é o da detecção, no fuso de Brasília. Os registros ficam salvos no navegador ao fechar e reabrir, mas eventos que ocorreram sem acompanhamento não são recuperados. O dia exibido muda à meia-noite de Brasília.

O processo da extensão consulta as APIs do Twish em intervalos de aproximadamente 30 segundos enquanto houver uma aba do CasalSkills no Twish aberta e a sessão estiver válida. O navegador pode atrasar o agendamento, especialmente quando o computador estiver suspenso. Dados sem confirmação recente deixam de ser exibidos como atuais. As consultas usam a sessão existente do navegador; não enviam comandos de pesca.

Na atualização, permita o acesso ao Twish se solicitado pelo navegador. A permissão alarms agenda as consultas, e o acesso ao host limita-se a https://twish.com.br/*.

## 🔗 Acesso direto ao Twish

Alguns recursos podem ser abertos diretamente em uma nova aba, incluindo Inventário, Loja e Comandos.

## 📦 Instalação

### Chrome

1. Baixe este repositório usando **Code → Download ZIP**.
2. Extraia o arquivo ZIP.
3. Abra `chrome://extensions/`.
4. Ative o **Modo do desenvolvedor**.
5. Clique em **Carregar sem compactação**.
6. Selecione a pasta extraída que contém `manifest.json`.
7. Recarregue as páginas da Twitch e do Twish. Mantenha o Twish aberto e conectado no mesmo navegador.

### Microsoft Edge

1. Baixe este repositório usando **Code → Download ZIP**.
2. Extraia o arquivo ZIP.
3. Abra `edge://extensions/`.
4. Ative o **Modo de desenvolvedor**.
5. Clique em **Carregar sem compactação**.
6. Selecione a pasta extraída que contém `manifest.json`.
7. Recarregue as páginas da Twitch e do Twish. Mantenha o Twish do CasalSkills aberto e conectado no mesmo navegador.

## 🚀 Como usar

Depois da instalação, abra um canal da Twitch que utilize o Twish. A barra de atalhos aparecerá próxima ao campo de mensagens. Use os atalhos para acessar seus comandos favoritos ou clique em `≡` para abrir o menu completo.

## 🔒 Privacidade e automação

A extensão funciona localmente no navegador e armazena as preferências localmente. O envio é manual por padrão. A opção Arremesso automático envia $pescar apenas após o clique do usuário no atalho rápido; não realiza pescas sozinha, não contorna cooldowns nem executa comandos repetidamente. As notificações começam desligadas e dependem das permissões do navegador e das configurações do Windows.

## 🛠️ Tecnologias

- JavaScript
- HTML/CSS gerados pela extensão
- Chrome Extensions — Manifest V3
- Web Storage para preferências locais

Não é necessário servidor nem instalação de dependências para utilizar a extensão.

## 🤝 Contribuições

Sugestões, melhorias e correções são bem-vindas. Caso encontre algum problema, abra uma **Issue** descrevendo o comportamento e, se possível, inclua uma captura de tela.

## ⚠️ Aviso

O **PescaSkills** é um projeto independente criado para facilitar o acesso aos comandos do Twish na Twitch. O projeto não é afiliado, patrocinado ou oficialmente mantido pela Twitch ou pelo Twish. **Twitch**, **Twish** e demais marcas mencionadas pertencem aos seus respectivos proprietários.

## 📄 Licença

Ainda não foi definida uma licença para o projeto. Antes de reutilizar, modificar ou redistribuir o código, consulte os termos definidos pelo autor do repositório.

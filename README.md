# 🎣 PescaSkills

Extensão para **Chrome e Microsoft Edge** criada para facilitar o uso dos comandos de pesca do Twish diretamente no chat da Twitch.

O **PescaSkills v1.0.1** adiciona uma barra de atalhos ao chat e um menu flutuante com comandos organizados por categoria.

## 🚀 Novas entregas

A versão aprovada com seletores redesenhados inclui pesca inteligente com cooldown, eventos em tempo real, busca de jogadores e seletores de iscas, venda, títulos e compra. Também traz a nomenclatura **Atalho**, versão automática em Ajustes e correções de interface e consistência. O envio é manual por padrão; o Arremesso automático opcional envia apenas $pescar quando o usuário clica no atalho rápido.

Confira a descrição completa em [Novas entregas](RELEASE_NOTES.md) e baixe o pacote aprovado na [pacote aprovado](releases/PescaSkills-v1.0.1.zip).

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
- 🚢 Progresso do Barco Misterioso consultado pela API a cada 15 segundos
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

Ao clicar em um comando de chat, a extensão preenche o campo de mensagem da Twitch. Por padrão, o usuário pressiona Enter. Ao ativar **Arremesso automático** em Ajustes, um clique no atalho rápido envia $pescar quando a pesca não está em cooldown. Os demais comandos permanecem manuais.

## ⭐ Barra de atalhos personalizável

Você pode escolher até **6 comandos** para deixar disponíveis diretamente na barra rápida. Use `☆` para adicionar e `★` para remover um atalho. O contador mostra os espaços utilizados (`Atalhos X/6`).

Clique e arraste os atalhos para organizar suas posições. As preferências são armazenadas localmente no navegador. O botão `≡` fica sempre disponível e não ocupa um dos seis espaços personalizáveis.

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
7. Abra ou atualize uma página da Twitch.

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

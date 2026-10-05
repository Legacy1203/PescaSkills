# Política de Privacidade — PescaSkills

Última atualização: 5 de outubro de 2026.

## Finalidade

O PescaSkills é uma extensão para Microsoft Edge que facilita o uso dos comandos do Twish no chat da Twitch. Exibe atalhos, cooldown, eventos e seletores de jogadores, iscas, peixes, títulos e itens da loja. Os comandos são preparados no campo do chat e enviados somente após a confirmação manual do usuário.

## Dados acessados e utilizados

A extensão lê nomes de usuário visíveis no chat da Twitch para a seleção de jogadores. Também lê o título e informações da página do Twish para identificar cooldown e eventos.

Na sessão já autenticada do usuário no Twish, consulta as APIs de conta/jogador, inventário, loja e títulos. As respostas podem incluir identificadores da conta, dados do jogador, saldo de moedas do jogo, equipamentos, itens possuídos, quantidades e títulos desbloqueados. Essas respostas são armazenadas localmente para disponibilizar os seletores na Twitch.

Também guarda as preferências de tema e atalhos e, nas versões que incluem o aviso inicial, sua confirmação. Não lê o conteúdo das mensagens do chat, não registra teclas nem mantém um histórico de navegação. Não solicita senhas, dados de cartão, localização ou informações de saúde.

## Armazenamento e duração

Os estados e respostas do Twish ficam no armazenamento local da extensão no navegador, compartilhado entre suas abas do Twish e da Twitch. São substituídos quando novas consultas são concluídas. O cache de inventário, loja, conta e títulos pode permanecer até ser substituído ou o armazenamento da extensão ser removido. Cooldown e eventos são removidos ao sair da página do Twish quando o navegador executa o evento correspondente.

Tema e atalhos ficam no armazenamento local do site da Twitch. A confirmação do aviso inicial fica no armazenamento local da extensão. Não existe um prazo automático de exclusão para todas essas preferências e caches.

## Comunicação e compartilhamento

As consultas são enviadas ao próprio Twish usando a sessão existente do navegador. O navegador pode enviar os cookies dessa sessão e os dados técnicos normais de uma conexão, como o endereço IP, ao Twish. A extensão não extrai senhas ou cookies para armazená-los ou enviá-los ao desenvolvedor.

O PescaSkills não envia os dados acessados a servidores do desenvolvedor, serviços de análise ou redes de publicidade. Não vende dados nem os transfere a terceiros para finalidades alheias ao funcionamento descrito. Não utiliza dados para avaliação de crédito ou concessão de empréstimos.

Quando o usuário confirma manualmente um comando no chat, o envio é realizado pela Twitch. Twitch e Twish tratam os dados em seus próprios serviços conforme suas respectivas políticas; esta política cobre o funcionamento da extensão.

## Controle do usuário

O usuário pode desativar ou remover a extensão nas configurações do Microsoft Edge. A remoção da extensão elimina seu armazenamento próprio. As preferências salvas no armazenamento do site da Twitch podem exigir a limpeza dos dados desse site nas configurações do navegador, o que também pode afetar outras preferências e a sessão da Twitch.

## Código e atualizações

O código executado pela extensão está incluído no pacote. As consultas ao Twish obtêm dados JSON, sem baixar ou executar código remoto. Esta política será atualizada quando houver mudanças nas práticas descritas.

## Contato

Responsável pelo projeto: Legacy1203.

Dúvidas sobre privacidade podem ser encaminhadas pelo [suporte do PescaSkills no GitHub](https://github.com/Legacy1203/PescaSkills/issues). As issues são públicas: não inclua senhas, tokens ou outros dados sensíveis.

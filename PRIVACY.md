# Política de Privacidade — PescaSkills

Última atualização: 22 de outubro de 2026.

## Finalidade

O PescaSkills é uma extensão para Microsoft Edge que facilita o uso dos comandos do Twish no chat da Twitch. Exibe atalhos, cooldown, eventos e seletores de jogadores, iscas, peixes, títulos e itens da loja. Os comandos são preparados no campo do chat e enviados após o usuário pressionar Enter. Se o usuário ativar Arremesso automático, o clique no atalho rápido de pesca envia $pescar; não há envio por temporizador.

## Dados acessados e utilizados

A extensão lê nomes de usuário visíveis no chat da Twitch para a seleção de jogadores. Cooldown e eventos são obtidos pelas APIs do Twish, sem depender do título ou dos contadores visuais da página.

Na sessão já autenticada do usuário no Twish, consulta as APIs de conta/jogador, inventário, loja, títulos e eventos ativos. As respostas podem incluir identificadores da conta, dados do jogador, saldo de moedas do jogo, equipamentos, itens possuídos, quantidades e títulos desbloqueados. Essas respostas são armazenadas localmente para disponibilizar os seletores na Twitch.

Também guarda preferências de tema, atalhos, ordem dos atalhos, Arremesso automático, sons e notificações. A consulta pública de eventos permite exibir a descrição, o tempo restante e o progresso do Barco Misterioso. Não lê o conteúdo das mensagens do chat, não registra teclas nem mantém um histórico de navegação. Não solicita senhas, dados de cartão, localização ou informações de saúde.

## Armazenamento e duração

Os estados e respostas do Twish ficam no armazenamento local da extensão no navegador, compartilhado entre suas abas do Twish e da Twitch. São substituídos quando novas consultas são concluídas. O cache de inventário, loja, conta e títulos pode permanecer até ser substituído ou o armazenamento da extensão ser removido. Os estados de pesca e eventos de uma sessão anterior do navegador são descartados quando a nova sessão de sincronização é inicializada. Fechar uma aba não apaga os estados de outras abas. A validade para apresentação é de até 90 segundos para pesca e eventos obtidos em segundo plano, respeitando também o prazo de término; os dados dos seletores exigidos para cada ação têm validade de 60 segundos por consulta. Falhas não renovam esses prazos.

Tema, atalhos, Arremesso automático e sons ficam no armazenamento local do site da Twitch. Preferências de notificações ficam no armazenamento local da extensão; estados de transição para evitar notificações repetidas ficam no armazenamento de sessão da extensão. Não existe um prazo automático de exclusão para todas essas preferências e caches.

O histórico diário armazena localmente nome e tipo do evento, horário de detecção, última confirmação, prazo estimado e indicação de encerramento confirmado. Não contém mensagens do chat. Os registros permanecem ao reabrir o navegador; a interface mostra apenas o dia atual no fuso de Brasília e o conjunto armazenado é substituído na primeira consulta válida de outro dia. Não recupera períodos sem acompanhamento.

## Comunicação e compartilhamento

O processo de segundo plano da extensão consulta apenas as APIs do Twish em intervalos de aproximadamente 30 segundos, sujeitos ao agendamento do navegador. Usa a sessão existente e verifica, entre as abas do host permitido https://twish.com.br/*, se há uma página do CasalSkills aberta; a verificação não cria um histórico de navegação. Sem essa aba, não inicia novas consultas. A permissão alarms agenda a sincronização e o acesso ao host Twish permite as consultas autenticadas e essa verificação. A extensão não solicita a permissão cookies nem lê diretamente os cookies. O navegador pode enviar os cookies dessa sessão e os dados técnicos normais de uma conexão, como o endereço IP, ao Twish. A extensão não extrai senhas ou cookies para armazená-los ou enviá-los ao desenvolvedor.

O PescaSkills não envia os dados acessados a servidores do desenvolvedor, serviços de análise ou redes de publicidade. Não vende dados nem os transfere a terceiros para finalidades alheias ao funcionamento descrito. Não utiliza dados para avaliação de crédito ou concessão de empréstimos.

Quando o usuário pressiona Enter ou clica no atalho de pesca com Arremesso automático ativado, o envio é realizado pela Twitch. Twitch e Twish tratam os dados em seus próprios serviços conforme suas respectivas políticas; esta política cobre o funcionamento da extensão.

As notificações são exibidas pelo sistema operacional e podem conter nome e descrição do evento ou a indicação de pesca disponível. Os controles de pesca e eventos são independentes e começam desligados. A permissão notifications é usada apenas para esses avisos.

## Controle do usuário

O usuário pode desativar ou remover a extensão nas configurações do Microsoft Edge. A remoção da extensão elimina seu armazenamento próprio. As preferências salvas no armazenamento do site da Twitch podem exigir a limpeza dos dados desse site nas configurações do navegador, o que também pode afetar outras preferências e a sessão da Twitch.

## Código e atualizações

O código executado pela extensão está incluído no pacote. As consultas ao Twish obtêm dados JSON, sem baixar ou executar código remoto. Esta política será atualizada quando houver mudanças nas práticas descritas.

## Contato

Responsável pelo projeto: Legacy1203.

Dúvidas sobre privacidade podem ser encaminhadas pelo [suporte do PescaSkills no GitHub](https://github.com/Legacy1203/PescaSkills/issues). As issues são públicas: não inclua senhas, tokens ou outros dados sensíveis.

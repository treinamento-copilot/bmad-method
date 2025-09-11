# Epic 2: Gestão de Convidados e Sistema de Confirmação

**Goal:** Implementar sistema completo de convites e confirmação de presença, permitindo que organizadores gerenciem participantes e que convidados respondam facilmente aos convites, criando a base social do aplicativo.

## Story 2.1: Links Compartilháveis do Evento
Como um organizador,
Eu quero compartilhar meu evento facilmente,
Para que os convidados possam acessá-lo sem complicações.

### Critérios de Aceitação
1. Link único compartilhável gerado para cada evento
2. Botão copiar link com feedback visual
3. Geração de QR code para compartilhamento móvel fácil
4. Botão de compartilhar no WhatsApp com mensagem pré-formatada
5. Link funciona sem exigir cadastro

## Story 2.2: Interface de Confirmação dos Convidados
Como um convidado,
Eu quero confirmar minha presença facilmente,
Para que o organizador saiba se eu vou comparecer.

### Critérios de Aceitação
1. Formulário simples de confirmação acessível via link compartilhado
2. Opções: Sim, Não, Talvez com estados visuais claros
3. Campo de nome do convidado (obrigatório)
4. Campo de telefone opcional
5. Mensagem de confirmação após envio da resposta

## Story 2.3: Gestão da Lista de Convidados
Como um organizador,
Eu quero ver quem está vindo ao meu evento,
Para que eu possa planejar adequadamente.

### Critérios de Aceitação
1. Lista de convidados em tempo real mostrando todas as confirmações
2. Indicadores visuais de status (Verde=Sim, Amarelo=Talvez, Cinza=Não)
3. Contagem de participantes confirmados exibida prominentemente
4. Nomes dos convidados e informações de contato visíveis ao organizador
5. Timestamp da última atualização para cada confirmação

## Story 2.4: Gestão de Prazo para Confirmações
Como um organizador,
Eu quero definir um prazo para confirmações,
Para que eu possa planejar as compras com certeza.

### Critérios de Aceitação
1. Configuração opcional de prazo para confirmações na criação do evento
2. Prazo exibido prominentemente na visualização dos convidados
3. Mensagem de aviso quando o prazo se aproxima
4. Atualização automática de status após o prazo passar
5. Comunicação clara sobre confirmações tardias

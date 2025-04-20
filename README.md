# ServiceAutoMate
Sistema de Automatização de Processo de Preenchimento de Solicitação de Serviço para Empresa de Transporte

## Para rodar

### Banco de dados - MongoDB

1. Verificar se o PostgreSQL está instalado
    Se você já instalou o PostgreSQL, tente verificar sua localização:
    No Prompt de Comando (cmd), execute:

    ```where psql```

    Se nenhum caminho for retornado, significa que o executável não está acessível globalmente.

2. Instalar o PostgreSQL (caso não esteja instalado)
    Se o PostgreSQL não estiver instalado, baixe e instale a versão mais recente do PostgreSQL:
    https://www.postgresql.org/download/

    Escolha a versão mais recente para Windows. Durante a instalação:
     - Selecione a opção "Instalar apenas o servidor"
     - Defina a senha do superusuário (postgres)
     - Selecione a porta de conexão (padrão é 5432)
     - Selecione o local de instalação

    Finalize a instalação.
     Observação: Se você deseja utilizar o pgAdmin, um cliente gráfico para gerenciar o PostgreSQL, selecione a opção "Instalar pgAdmin" durante a instalação.

### API - dotnet

1. Baixar e instalar o .NET SDK

    Acesse o site oficial do .NET e baixe o .NET SDK (versão 8) para Windows.
    https://dotnet.microsoft.com/pt-br/download/dotnet/8.0

    Execute o instalador e siga as instruções para instalar o .NET SDK.

2. Publicar a API
    Abra o terminal da pasta da API "ServiceAutoMateAPI" e execute o comando:

    ```dotnet publish -c Release -o "C:\ServiceAutoMateAPI"```

    Isso irá publicar a API em modo Release e criar um diretório "C:\ServiceAutoMateAPI" com os arquivos necessários para executar a API.

3. Criar o serviço
    Abra o Prompt de Comando (cmd) como administrador:

    Pressione a tecla Windows + R e digite cmd
    Clique com o botão direito no ícone do Prompt de Comando e selecione "Executar como administrador"
    Execute o comando:

    ```sc create ServiceAutoMateAPI binPath= "C:\ServiceAutoMateAPI\ServiceAutoMateAPI.exe"```

    Isso irá criar um novo serviço chamado "ServiceAutoMateAPI" que irá executar a API.

4. Iniciar o serviço
    Execute o comando:

    ```net start ServiceAutoMateAPI```

    Isso irá iniciar o serviço "ServiceAutoMateAPI".

5. Verificar se o serviço está em execução
    Execute o comando:

    ```sc query ServiceAutoMateAPI```

    Isso irá mostrar informações sobre o serviço, incluindo seu estado atual.

6. Verificar a porta
    Execute o comando:

    ```netstat -ano | findstr :5238```

    Isso irá mostrar informações sobre as conexões de rede ativas, incluindo a porta 5238 que a API está usando.

Agora você pode acessar a API através da URL http://localhost:5238.

### Frontend

Pré-requisitos
    Node.js (versão 14 ou superior)
    Yarn (versão 1.22 ou superior)

1. Instalar Node.js e Yarn
    Baixe e instale o Node.js a partir do site oficial: <https://nodejs.org/pt-br/download/>
    Durante a instalação, certifique-se de selecionar a opção para instalar o Yarn.
    Verifique se o Node.js e o Yarn estão instalados corretamente executando os seguintes comandos no terminal:
    
    ```node -v```
    ```yarn -v```

2. Instalar as dependências
    Abra o terminal na pasta do projeto ServiceAutoMateApp e execute o comando:

    ```yarn install```

    Isso irá instalar as dependências necessárias para o projeto.

3. Rodar o projeto
    Execute o comando:

    ```yarn dev```

    Isso irá iniciar o servidor de desenvolvimento e abrir o aplicativo em um navegador.

Agora você pode acessar o aplicativo frontend através da URL http://localhost:5173/

### Grafana

1. Instalar o Grafana
    Acesse https://grafana.com/grafana/download e faça o download para o seu sistema operacional
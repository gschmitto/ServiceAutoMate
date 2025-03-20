# ServiceAutoMate
Sistema de Automatização de Processo de Preenchimento de Solicitação de Serviço para Empresa de Transporte

## Para rodar

### Banco de dados - MongoDB

1. Verificar se o MongoDB está instalado
    Se você já instalou o MongoDB, tente verificar sua localização:

    No Prompt de Comando (cmd), execute:

    ```where mongod```

    Se nenhum caminho for retornado, significa que o executável não está acessível globalmente.

2. Instalar o MongoDB (caso não esteja instalado)
    Se o MongoDB não estiver instalado, baixe e instale a versão MongoDB Community Server:
    https://www.mongodb.com/try/download/community

    Escolha a versão mais recente para Windows.
    Durante a instalação:
    - "Install MongoDB as a Service" (Recomendado)
    - Service Name: defina-o como ServiceAutoMate
    - Start MongoDB as Network Service User (deixe selecionado)
    - Install MongoDB Compass (seleciona instalar junto)

    Finalize a instalação.

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

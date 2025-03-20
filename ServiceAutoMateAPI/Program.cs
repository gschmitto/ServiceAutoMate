using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ServiceAutoMateAPI.Data;
using FluentValidation;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Models.Validators;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Middleware;
using ServiceAutoMateAPI.Commands.Clientes;
using ServiceAutoMateAPI.Commands.Clientes.Validators;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.Commands.SolicitacoesServico.Validators;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();
builder.WebHost.UseUrls(builder.Configuration["Urls"]!);

// Configuração do MongoDB
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var mongoDbSettings = serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(mongoDbSettings.ConnectionString);
});
builder.Services.AddSingleton(serviceProvider =>
{
    var mongoDbSettings = serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDbSettings.DatabaseName);
});

// Adicionar o MongoDBService
builder.Services.AddSingleton<MongoDBService>();

// Adicionar o filtro de exceção global
builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomValidationExceptionFilter>();
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Registrar o repositório
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ISolicitacaoServicoRepository, SolicitacaoServicoRepository>();

// Registrar o FluentValidation
builder.Services.AddScoped<IValidator<CriarClienteCommand>, CriarClienteCommandValidator>();
builder.Services.AddScoped<IValidator<EditarClienteCommand>, EditarClienteCommandValidator>();
builder.Services.AddScoped<IValidator<FretePorCidade>, FretePorCidadeValidator>();

builder.Services.AddScoped<IValidator<CriarSolicitacaoServicoCommand>, CriarSolicitacaoServicoCommandValidator>();
builder.Services.AddScoped<IValidator<EditarSolicitacaoServicoCommand>, EditarSolicitacaoServicoCommandValidator>();
builder.Services.AddScoped<IValidator<DadosNotaFiscal>, DadosNotaFiscalValidator>();

// Adicionar serviços ao contêiner
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ServiceAutoMate API", Version = "v1" });
});

var app = builder.Build();

// Configurar o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ServiceAutoMate API V1");
    });
}

app.UseHttpsRedirection();
app.MapControllers();

await app.RunAsync();

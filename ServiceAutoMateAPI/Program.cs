using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Models.Validators;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Middleware;
using ServiceAutoMateAPI.Commands.Clientes;
using ServiceAutoMateAPI.Commands.Clientes.Validators;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.Commands.SolicitacoesServico.Validators;
using ServiceAutoMateAPI.Data;
using ServiceAutoMateAPI.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();
builder.WebHost.UseUrls(builder.Configuration["Urls"]!);

// Configuração do Entity Framework Core com PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSql")));

// Adicionar o filtro de exceção global
builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomValidationExceptionFilter>();
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Registrar o repositório
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ISolicitacaoServicoRepository, SolicitacaoServicoRepository>();
builder.Services.AddScoped<IPrevisaoMonitoramentoRepository, PrevisaoMonitoramentoRepository>();

// Registrar o FluentValidation
builder.Services.AddScoped<IValidator<CriarClienteCommand>, CriarClienteCommandValidator>();
builder.Services.AddScoped<IValidator<EditarClienteCommand>, EditarClienteCommandValidator>();
builder.Services.AddScoped<IValidator<FretePorCidade>, FretePorCidadeValidator>();

builder.Services.AddScoped<IValidator<CriarSolicitacaoServicoCommand>, CriarSolicitacaoServicoCommandValidator>();
builder.Services.AddScoped<IValidator<EditarSolicitacaoServicoCommand>, EditarSolicitacaoServicoCommandValidator>();
builder.Services.AddScoped<IValidator<DadosNotaFiscal>, DadosNotaFiscalValidator>();

builder.Services.AddScoped<PrevisaoService>();

// Adicionar serviços ao contêiner
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ServiceAutoMate API", Version = "v1" });
});

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var context = services.GetRequiredService<AppDbContext>();
//     var seedData = new SeedData();
//     seedData.SeedSolicitacoesAsync(context).Wait();
// }

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

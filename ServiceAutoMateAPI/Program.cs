using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ServiceAutoMateAPI.Data;

var builder = WebApplication.CreateBuilder(args);

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
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

await app.RunAsync();

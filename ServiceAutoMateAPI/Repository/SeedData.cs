using Microsoft.EntityFrameworkCore;
using ServiceAutoMateAPI.Data;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class SeedData
    {
        public async Task SeedSolicitacoesAsync(AppDbContext context)
        {
            var clientes = new[]
            {
                new {
                    Id = Guid.Parse("8b6a9cc2-6877-4256-89b1-d4c8e025067e"),
                    Nome = "Gasparetto",
                    ValorMaximoNota = 2000,
                    PorcentagemCobranca = 4.0
                },
                new {
                    Id = Guid.Parse("3f60d62f-5e33-45f1-bf1f-c140312377c4"),
                    Nome = "Vespor",
                    ValorMaximoNota = 1500,
                    PorcentagemCobranca = 1.4
                }
            };

            var fretes = await context.FretesPorCidade.ToListAsync();

            var random = new Random();
            var numeroNotaBase = random.Next(100000, 999999);

            for (int i = 0; i < 200; i++) // cria 10 solicitações
            {
                var cliente = clientes[random.Next(clientes.Length)];

                var cidadesCliente = fretes.Where(f => f.ClienteId == cliente.Id).ToList();
                var cidadeSelecionada = cidadesCliente[random.Next(cidadesCliente.Count)];

                var solicitacao = new SolicitacaoServico
                {
                    Id = Guid.NewGuid(),
                    ClienteId = cliente.Id,
                    Destinatario = Faker.CompanyFaker.Name(),
                    CidadeDestinatario = cidadeSelecionada.Cidade,
                    QuantidadeVolumes = random.Next(1, 5),
                    ValorFrete = cidadeSelecionada.Valor,
                    DataCriacao = DateTime.SpecifyKind(new DateTime(2024, 7, random.Next(1, 31)), DateTimeKind.Utc)
                };

                context.Solicitacoes.Add(solicitacao);

                await context.SaveChangesAsync();

                var quantidadeNotas = random.Next(1, 6);

                decimal somaNotas = 0;

                for (int j = 0; j < quantidadeNotas; j++)
                {
                    var notaFiscal = new DadosNotaFiscal
                    {
                        Id = Guid.NewGuid(),
                        SolicitacaoServicoId = solicitacao.Id,
                        NumeroNota = numeroNotaBase++.ToString(),
                        ValorNota = Math.Round((decimal)random.NextDouble() * (3000 - 500) + 500, 2)
                    };

                    somaNotas += notaFiscal.ValorNota;

                    context.NotasFiscais.Add(notaFiscal);
                }

                if (somaNotas > cliente.ValorMaximoNota)
                {
                    var novoValorFrete = somaNotas * (decimal)cliente.PorcentagemCobranca / 100;
                    if (novoValorFrete > solicitacao.ValorFrete)
                    {
                        solicitacao.ValorFrete = novoValorFrete;
                        context.Entry(solicitacao).State = EntityState.Modified;
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
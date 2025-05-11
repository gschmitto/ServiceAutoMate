using Microsoft.EntityFrameworkCore;
using ServiceAutoMateAPI.Data;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class PrevisaoMonitoramentoRepository(AppDbContext context) : IPrevisaoMonitoramentoRepository
    {
        private readonly AppDbContext _context = context;

        public async Task InserirOuAtualizarAsync(List<PrevisaoMonitoramento> previsoes, CancellationToken cancellationToken)
        {
            foreach (var previsao in previsoes)
            {
                var existente = await _context.PrevisoesMonitoramento
                    .FirstOrDefaultAsync(p => p.Mes == previsao.Mes && p.Ano == previsao.Ano, cancellationToken);

                if (existente != null)
                {
                    // Atualiza os campos existentes
                    existente.PrevisaoFrete = previsao.PrevisaoFrete;
                    existente.DataRegistro = DateTime.UtcNow;
                    _context.PrevisoesMonitoramento.Update(existente);
                }
                else
                {
                    // Insere nova previsão
                    previsao.DataRegistro = DateTime.UtcNow;
                    await _context.PrevisoesMonitoramento.AddAsync(previsao, cancellationToken);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
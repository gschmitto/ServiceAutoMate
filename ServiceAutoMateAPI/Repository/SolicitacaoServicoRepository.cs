using Microsoft.EntityFrameworkCore;
using ServiceAutoMateAPI.Data;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class SolicitacaoServicoRepository(AppDbContext context) : ISolicitacaoServicoRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<SolicitacaoServico> AddAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken)
        {
            _context.Solicitacoes.Add(solicitacao);
            foreach (var notasFiscais in solicitacao.NotasFiscais!)
            {
                _context.NotasFiscais.Add(notasFiscais);
            }
            await _context.SaveChangesAsync(cancellationToken);
            return solicitacao;
        }

        public async Task<IEnumerable<SolicitacaoServico>> GetPaginationAsync(Guid? clienteId, DateTime? dataInicio, DateTime? dataFim, int page, int pageSize)
        {
            var query = _context.Solicitacoes
                .Include(s => s.NotasFiscais)
                .AsQueryable();

            if (clienteId.HasValue)
                query = query.Where(s => s.ClienteId == clienteId.Value);

            if (dataInicio.HasValue)
                query = query.Where(s => (s.DataEdicao ?? s.DataCriacao) >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(s => (s.DataEdicao ?? s.DataCriacao) <= dataFim.Value);

            return await query
                .OrderByDescending(s => s.DataEdicao ?? s.DataCriacao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<long> GetTotalAsync(Guid? clienteId, DateTime? dataInicio, DateTime? dataFim)
        {
            var query = _context.Solicitacoes.AsQueryable();

            if (clienteId.HasValue)
                query = query.Where(s => s.ClienteId == clienteId.Value);

            if (dataInicio.HasValue)
                query = query.Where(s => s.DataCriacao >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(s => s.DataCriacao <= dataFim.Value);

            return await query.LongCountAsync();
        }

        public async Task<SolicitacaoServico> GetByIdAsync(Guid id)
        {
            return await _context.Solicitacoes
                .Include(s => s.NotasFiscais)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id) ?? throw new InvalidOperationException("Entity not found");
        }

        public async Task UpdateAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken)
        {
            var solicitacaoExistente = await _context.Solicitacoes.FindAsync([solicitacao.Id], cancellationToken: cancellationToken);
            if (solicitacaoExistente != null)
            {
                var notasFiscaisExistente = await _context.NotasFiscais.Where(f => f.SolicitacaoServicoId == solicitacao.Id).ToListAsync(cancellationToken: cancellationToken);
                foreach (var notaFiscal in solicitacao.NotasFiscais)
                {
                    var notaFiscalExistente = notasFiscaisExistente.FirstOrDefault(f => f.Id == notaFiscal.Id);
                    if (notaFiscalExistente != null)
                    {
                        notaFiscalExistente.NumeroNota = notaFiscal.NumeroNota;
                        notaFiscalExistente.ValorNota = notaFiscal.ValorNota;
                    }
                    else
                    {
                        solicitacaoExistente.AdicionarNotaFiscal(notaFiscal);
                        _context.NotasFiscais.Add(notaFiscal);
                    }
                }
        
                var notasFiscaisParaRemover = notasFiscaisExistente.Where(f => !solicitacao.NotasFiscais.Any(c => c.Id == f.Id));
                _context.NotasFiscais.RemoveRange(notasFiscaisParaRemover);

                _context.Entry(solicitacaoExistente).CurrentValues.SetValues(solicitacao);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _context.Solicitacoes.FindAsync(id);
            if (entity is not null)
            {
                var notasFiscais = await _context.NotasFiscais.Where(f => f.SolicitacaoServicoId == id).ToListAsync();
                _context.NotasFiscais.RemoveRange(notasFiscais);

                _context.Solicitacoes.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}

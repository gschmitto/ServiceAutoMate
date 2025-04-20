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
            await _context.SaveChangesAsync(cancellationToken);
            return solicitacao;
        }

        public async Task<IEnumerable<SolicitacaoServico>> GetPaginationAsync(Guid? clienteId, DateTime? dataInicio, DateTime? dataFim, int page, int pageSize)
        {
            var query = _context.Solicitacoes.AsQueryable();

            if (clienteId.HasValue)
                query = query.Where(s => s.ClienteId == clienteId.Value);

            if (dataInicio.HasValue)
                query = query.Where(s => s.DataCriacao >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(s => s.DataCriacao <= dataFim.Value);

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
            _context.Solicitacoes.Update(solicitacao);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _context.Solicitacoes.FindAsync(id);
            if (entity is not null)
            {
                _context.Solicitacoes.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}

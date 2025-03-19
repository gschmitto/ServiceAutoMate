using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public interface ISolicitacaoServicoRepository
    {
        Task<SolicitacaoServico> AddAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken);
        Task<long> GetTotalAsync();
        Task<IEnumerable<SolicitacaoServico>> GetPaginationAsync(
            string? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim,
            int page,
            int pageSize);
        Task<SolicitacaoServico> GetByIdAsync(string id);
        Task UpdateAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken);
        Task DeleteAsync(string id);
    }
}
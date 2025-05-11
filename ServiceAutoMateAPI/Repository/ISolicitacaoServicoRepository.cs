using ServiceAutoMateAPI.DTOs;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public interface ISolicitacaoServicoRepository
    {
        Task<SolicitacaoServico> AddAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken);
        Task<long> GetTotalAsync(
            Guid? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim
        );
        Task<IEnumerable<SolicitacaoServico>> GetPaginationAsync(
            Guid? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim,
            int page,
            int pageSize);
        Task<SolicitacaoServico> GetByIdAsync(Guid id);
        Task UpdateAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id);
        Task<List<PrevisaoFaturamentoDto>> ObterDadosAgrupadosMensalAsync(CancellationToken cancellationToken);
    }
}
using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class ObterSolicitacoesServicoQueryHandler(ISolicitacaoServicoRepository solicitacaoServicoRepository)
        : IRequestHandler<ObterSolicitacoesServicoQuery, PagedResult<SolicitacaoServico>>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;

        public async Task<PagedResult<SolicitacaoServico>> Handle(
            ObterSolicitacoesServicoQuery request,
            CancellationToken cancellationToken)
        {
            var totalCount = await _solicitacaoServicoRepository.GetTotalAsync();

            var solicitacoesServico = await _solicitacaoServicoRepository.GetPaginationAsync(
                request.ClienteId,
                request.DataInicial,
                request.DataFinal,
                request.Page,
                request.PageSize);

            return new PagedResult<SolicitacaoServico>(
                solicitacoesServico,
                totalCount,
                request.Page,
                request.PageSize);
        }
    }
}

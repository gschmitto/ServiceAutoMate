using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Responses;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class ObterSolicitacoesServicoQueryHandler(ISolicitacaoServicoRepository solicitacaoServicoRepository)
        : IRequestHandler<ObterSolicitacoesServicoQuery, PagedResult<SolicitacaoServicoResponse>>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;

        public async Task<PagedResult<SolicitacaoServicoResponse>> Handle(
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

            var solicitacoesServicoResponse = solicitacoesServico.Select(s => new SolicitacaoServicoResponse
            {
                SolicitacaoServico = s,
                TotalNotas = s.NotasFiscais.Sum(n => n.ValorNota)
            }).ToList();

            return new PagedResult<SolicitacaoServicoResponse>(
                solicitacoesServicoResponse,
                totalCount,
                request.Page,
                request.PageSize);
        }
    }
}

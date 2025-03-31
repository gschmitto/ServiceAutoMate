using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Responses;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class ObterSolicitacoesServicoQueryHandler(
        ISolicitacaoServicoRepository solicitacaoServicoRepository,
        IClienteRepository clienteRepository)
        : IRequestHandler<ObterSolicitacoesServicoQuery, PagedResult<SolicitacaoServicoResponse>>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;
        private readonly IClienteRepository _clienteRepository = clienteRepository;

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

            var solicitacoesServicoResponse = new List<SolicitacaoServicoResponse>();
            foreach (var s in solicitacoesServico)
            {
                var cliente = await _clienteRepository.GetByIdAsync(s.ClienteId);
                solicitacoesServicoResponse.Add(new SolicitacaoServicoResponse
                {
                    SolicitacaoServico = s,
                    TotalNotas = s.NotasFiscais.Sum(n => n.ValorNota),
                    NomeCliente = cliente?.NomeEmpresa ?? ""
                });
            }

            return new PagedResult<SolicitacaoServicoResponse>(
                solicitacoesServicoResponse,
                totalCount,
                request.Page,
                request.PageSize);
        }
    }
}

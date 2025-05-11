using MediatR;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Responses;
using ServiceAutoMateAPI.Services;

namespace ServiceAutoMateAPI.Handlers.Monitoramento
{
    public class ObterPrevisaoFaturamentoHandler(
        ISolicitacaoServicoRepository repository,
        PrevisaoService previsaoService)
        : IRequestHandler<ObterPrevisaoFaturamentoQuery, PrevisaoResponse>
    {
        private readonly ISolicitacaoServicoRepository _repository = repository;
        private readonly PrevisaoService _previsaoService = previsaoService;

        public async Task<PrevisaoResponse> Handle(ObterPrevisaoFaturamentoQuery request, CancellationToken cancellationToken)
        {
            var dadosAgrupados = await _repository.ObterDadosAgrupadosMensalAsync(cancellationToken);

            return _previsaoService.CalcularPrevisao(dadosAgrupados);
        }
    }
}
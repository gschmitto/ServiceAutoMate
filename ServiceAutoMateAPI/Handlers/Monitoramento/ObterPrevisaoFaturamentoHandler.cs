using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Responses;
using ServiceAutoMateAPI.Services;

namespace ServiceAutoMateAPI.Handlers.Monitoramento
{
    public class ObterPrevisaoFaturamentoHandler(
        ISolicitacaoServicoRepository repository,
        PrevisaoService previsaoService,
        IPrevisaoMonitoramentoRepository previsaoMonitoramentoRepository)
        : IRequestHandler<ObterPrevisaoFaturamentoQuery, List<PrevisaoResponse>>
    {
        private readonly ISolicitacaoServicoRepository _repository = repository;
        private readonly PrevisaoService _previsaoService = previsaoService;
        private readonly IPrevisaoMonitoramentoRepository _previsaoMonitoramentoRepository = previsaoMonitoramentoRepository;

        public async Task<List<PrevisaoResponse>> Handle(ObterPrevisaoFaturamentoQuery request, CancellationToken cancellationToken)
        {
            var dadosAgrupados = await _repository.ObterDadosAgrupadosMensalAsync(cancellationToken);
            var previsoes = _previsaoService.CalcularPrevisaoComModeloSalvo(dadosAgrupados, request.QuantidadeMeses, "MLModel/ModeloPrevisaoFrete.zip");

            var entidades = previsoes.Select(p => new PrevisaoMonitoramento
            {
                Mes = p.Mes,
                Ano = p.Ano,
                PrevisaoFrete = p.PrevisaoFrete,
                DataRegistro = DateTime.UtcNow
            }).ToList();

            await _previsaoMonitoramentoRepository.InserirOuAtualizarAsync(entidades, cancellationToken);

            return previsoes;
        }
    }
}
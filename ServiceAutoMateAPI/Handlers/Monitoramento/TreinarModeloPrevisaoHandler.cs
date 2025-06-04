using MediatR;
using ServiceAutoMateAPI.Commands.Monitoramento;
using ServiceAutoMateAPI.Repository;
using ServiceAutoMateAPI.Services;

namespace ServiceAutoMateAPI.Handlers.Monitoramento
{
    public class TreinarModeloPrevisaoHandler(
        ISolicitacaoServicoRepository repository,
        PrevisaoService previsaoService)
        : IRequestHandler<TreinarModeloPrevisaoCommand, ResultadoAvaliacaoML>
    {
        private readonly ISolicitacaoServicoRepository _repository = repository;
        private readonly PrevisaoService _previsaoService = previsaoService;

        public async Task<ResultadoAvaliacaoML> Handle(TreinarModeloPrevisaoCommand request, CancellationToken cancellationToken)
        {
            var dados = await _repository.ObterDadosAgrupadosMensalAsync(cancellationToken);

            if (dados.Count < 3)
                throw new Exception("Não há dados suficientes para treinar o modelo.");

            var dadosTreinamento = dados.OrderBy(d => d.Ano).ThenBy(d => d.Mes).ToList();
            dadosTreinamento.RemoveAt(dadosTreinamento.Count - 1); // Remove o último mês

            var resultado = _previsaoService.TreinarAvaliarEMemorizarModelo(dadosTreinamento, "MLModel/ModeloPrevisaoFrete.zip");

            return resultado;
        }
    }
}

using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public interface IPrevisaoMonitoramentoRepository
    {
        Task InserirOuAtualizarAsync(List<PrevisaoMonitoramento> previsoes, CancellationToken cancellationToken);
    }
}
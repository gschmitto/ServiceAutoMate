using MediatR;
using ServiceAutoMateAPI.Services;

namespace ServiceAutoMateAPI.Commands.Monitoramento
{
    public class TreinarModeloPrevisaoCommand : IRequest<ResultadoAvaliacaoML>
    {
    }
}

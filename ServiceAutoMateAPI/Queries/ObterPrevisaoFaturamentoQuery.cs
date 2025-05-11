using MediatR;
using ServiceAutoMateAPI.Responses;

namespace ServiceAutoMateAPI.Queries
{
    public class ObterPrevisaoFaturamentoQuery : IRequest<List<PrevisaoResponse>>
    {
        public int QuantidadeMeses { get; set; }
    }
}
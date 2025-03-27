using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Responses;

namespace ServiceAutoMateAPI.Queries
{
    public class ObterSolicitacoesServicoQuery(
        string? clienteId,
        DateTime? dataInicial,
        DateTime? dataFinal,
        int page,
        int pageSize) : IRequest<PagedResult<SolicitacaoServicoResponse>>
    {
        public string? ClienteId { get; set; } = clienteId;
        public DateTime? DataInicial { get; set; } = dataInicial;
        public DateTime? DataFinal { get; set; } = dataFinal;
        public int Page { get; set; } = page;
        public int PageSize { get; set; } = pageSize;
    }
}

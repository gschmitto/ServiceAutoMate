using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Responses
{
    public class SolicitacaoServicoResponse
    {
        public required SolicitacaoServico SolicitacaoServico { get; set; }
        public decimal TotalNotas { get; set; }
        public required string NomeCliente { get; set; }
    }
}
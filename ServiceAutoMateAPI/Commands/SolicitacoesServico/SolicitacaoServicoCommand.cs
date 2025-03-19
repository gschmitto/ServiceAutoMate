using MediatR;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Commands.SolicitacoesServico
{
    public abstract class SolicitacaoServicoCommand : IRequest<SolicitacaoServico>
    {
        public required string ClienteId { get; set; }
        public int QuantidadeVolumes { get; set; }
        public required string Destinatario { get; set; }
        public required string CidadeDestinatario { get; set; }
        public required List<DadosNotaFiscal> NotasFiscais { get; set; } = [];

        public decimal CalcularTotalNotas()
        {
            return NotasFiscais.Sum(nf => nf.ValorNota);
        }
    }
}

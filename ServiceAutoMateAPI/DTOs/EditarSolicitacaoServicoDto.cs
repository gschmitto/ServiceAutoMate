using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.DTOs
{
    public class EditarSolicitacaoServicoDto
    {
        public int QuantidadeVolumes { get; set; }
        public required string Destinatario { get; set; }
        public required string CidadeDestinatario { get; set; }
        public required List<DadosNotaFiscal> NotasFiscais { get; set; } = [];
    }
}
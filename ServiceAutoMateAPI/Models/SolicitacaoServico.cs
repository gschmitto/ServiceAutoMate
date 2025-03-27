namespace ServiceAutoMateAPI.Models
{
    public class SolicitacaoServico
    {
        public required string Id { get; set; }
        public required string ClienteId { get; set; }
        public required string Destinatario { get; set; }
        public required string CidadeDestinatario { get; set; }
        public int QuantidadeVolumes { get; set; }
        public decimal ValorFrete { get; set; }
        public List<DadosNotaFiscal> NotasFiscais { get; set; } = [];
        public DateTime DataCriacao { get; set; }
        public DateTime? DataEdicao { get; set; }
    }
}

namespace ServiceAutoMateAPI.Models
{
    public class SolicitacaoServico
    {
        public required Guid Id { get; set; }
        public required Guid ClienteId { get; set; }
        public required string Destinatario { get; set; }
        public required string CidadeDestinatario { get; set; }
        public int QuantidadeVolumes { get; set; }
        public decimal ValorFrete { get; set; }
        public List<DadosNotaFiscal> NotasFiscais { get; set; } = [];
        public DateTime DataCriacao { get; set; }
        public DateTime? DataEdicao { get; set; }

        public void AdicionarNotaFiscal(DadosNotaFiscal notaFiscal)
        {
            NotasFiscais.Add(notaFiscal);
        }
    }
}

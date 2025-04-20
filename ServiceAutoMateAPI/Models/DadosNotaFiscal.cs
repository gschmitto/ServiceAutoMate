namespace ServiceAutoMateAPI.Models
{
    public class DadosNotaFiscal
    {
        public required Guid Id { get; set; }
        public Guid SolicitacaoServicoId { get; set; }
        public required string NumeroNota { get; set; }
        public required decimal ValorNota { get; set; }
    }
}
namespace ServiceAutoMateAPI.Models
{
    public class Cliente
    {
        public required Guid Id { get; set; }
        public required string NomeEmpresa { get; set; }
        public required string Endereco { get; set; }
        public required string Cidade { get; set; }
        public List<FretePorCidade>? ValorFretePorCidade { get; set; }
        public decimal ValorMaximoNota { get; set; }
        public decimal PorcentagemCobranca { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataEdicao { get; set; }

        public decimal GetValorFretePorCidade(string cidadeDestinatario, decimal totalNotas)
        {
            var frete = (ValorFretePorCidade?
                .FirstOrDefault(f => f.Cidade.Equals(cidadeDestinatario, StringComparison.OrdinalIgnoreCase)))
                ?? throw new InvalidOperationException($"Não há valor de frete cadastrado para a cidade de '{cidadeDestinatario}' para este cliente.");
            
            var valorFrete = frete.Valor;

            if (totalNotas >= ValorMaximoNota)
            {
                var porcentagemCobrancaFrete = totalNotas * (PorcentagemCobranca / 100);
                if (porcentagemCobrancaFrete > frete.Valor)
                {
                    valorFrete = porcentagemCobrancaFrete;
                }
            }

            return valorFrete;
        }
    }
}

namespace ServiceAutoMateAPI.Models
{
    public class FretePorCidade
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public required string Cidade { get; set; }
        public required decimal Valor { get; set; }
    }
}

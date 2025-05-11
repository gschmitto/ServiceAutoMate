namespace ServiceAutoMateAPI.Models
{
    public class PrevisaoMonitoramento
    {
        public int Id { get; set; }
        public int Mes { get; set; }
        public int Ano { get; set; }
        public float PrevisaoFrete { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}
using Microsoft.EntityFrameworkCore;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Data
{
    public class AppDbContext(IConfiguration configuration) : DbContext
    {
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<SolicitacaoServico> Solicitacoes { get; set; }
        public DbSet<FretePorCidade> FretesPorCidade { get; set; }
        public DbSet<DadosNotaFiscal> NotasFiscais { get; set; }
        public DbSet<PrevisaoMonitoramento> PrevisoesMonitoramento { get; set; }
        private readonly IConfiguration _configuration = configuration;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
}
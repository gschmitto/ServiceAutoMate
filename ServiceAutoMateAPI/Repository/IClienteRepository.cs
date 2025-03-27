using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public interface IClienteRepository
    {
        Task<Cliente> AddAsync(Cliente cliente, CancellationToken cancellationToken);
        Task<long> GetTotalAsync();
        Task<IEnumerable<Cliente>> GetPaginationAsync(int page, int pageSize, string? nome = null);
        Task<Cliente> GetByDetailsAsync(string nomeEmpresa, string endereco, string cidade, string? id);
        Task<Cliente> GetByIdAsync(string id);
        Task UpdateAsync(Cliente cliente, CancellationToken cancellationToken);
        Task DeleteAsync(string id);
    }
}
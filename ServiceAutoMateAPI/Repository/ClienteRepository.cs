using MongoDB.Driver;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class ClienteRepository(IMongoDatabase database) : IClienteRepository
    {
        private readonly IMongoCollection<Cliente> _clientesCollection = database.GetCollection<Cliente>("Clientes");

        public async Task<Cliente> AddAsync(Cliente cliente, CancellationToken cancellationToken)
        {
            await _clientesCollection.InsertOneAsync(cliente, cancellationToken: cancellationToken);
            return cliente;
        }

        public async Task<IEnumerable<Cliente>> GetPaginationAsync(int page, int pageSize)
        {
            return await _clientesCollection
                .Find(FilterDefinition<Cliente>.Empty)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<long> GetTotalAsync()
        {
            return await _clientesCollection.CountDocumentsAsync(FilterDefinition<Cliente>.Empty);
        }

        public async Task<Cliente> GetByDetailsAsync(string nomeEmpresa, string endereco, string cidade, string? id)
        {
            return await _clientesCollection
                .Find(cliente => 
                    cliente.NomeEmpresa == nomeEmpresa && 
                    cliente.Endereco == endereco && 
                    cliente.Cidade == cidade &&
                    cliente.Id != id)
                .FirstOrDefaultAsync();
        }

        public async Task<Cliente> GetByIdAsync(string id)
        {
            return await _clientesCollection.Find(cliente => cliente.Id == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Cliente cliente, CancellationToken cancellationToken)
        {
            var filter = Builders<Cliente>.Filter.Eq(c => c.Id, cliente.Id);
            var update = Builders<Cliente>.Update
                .Set(c => c.NomeEmpresa, cliente.NomeEmpresa)
                .Set(c => c.Endereco, cliente.Endereco)
                .Set(c => c.Cidade, cliente.Cidade)
                .Set(c => c.ValorFretePorCidade, cliente.ValorFretePorCidade)
                .Set(c => c.ValorMaximoNota, cliente.ValorMaximoNota)
                .Set(c => c.PorcentagemCobranca, cliente.PorcentagemCobranca);

            await _clientesCollection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        }

        public async Task DeleteAsync(string id)
        {
            await _clientesCollection.DeleteOneAsync(c => c.Id == id);
        }
    }
}

using MongoDB.Driver;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class SolicitacaoServicoRepository(IMongoDatabase database) : ISolicitacaoServicoRepository
    {
        private readonly IMongoCollection<SolicitacaoServico> _solicitacoesCollection = database.GetCollection<SolicitacaoServico>("SolicitacoesServico");

        public async Task<SolicitacaoServico> AddAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken)
        {
            await _solicitacoesCollection.InsertOneAsync(solicitacao, cancellationToken: cancellationToken);
            return solicitacao;
        }

        public async Task<IEnumerable<SolicitacaoServico>> GetPaginationAsync(string? clienteId, DateTime? dataInicio, DateTime? dataFim, int page, int pageSize)
        {
            var filterBuilder = Builders<SolicitacaoServico>.Filter;
            var filters = new List<FilterDefinition<SolicitacaoServico>>();

            if (!string.IsNullOrEmpty(clienteId))
            {
                filters.Add(filterBuilder.Eq(s => s.ClienteId, clienteId));
            }

            if (dataInicio.HasValue)
            {
                filters.Add(filterBuilder.Gte(s => s.DataCriacao, dataInicio.Value));
            }

            if (dataFim.HasValue)
            {
                filters.Add(filterBuilder.Lte(s => s.DataCriacao, dataFim.Value));
            }

            var filter = filters.Count > 0 ? filterBuilder.And(filters) : FilterDefinition<SolicitacaoServico>.Empty;

            return await _solicitacoesCollection
                .Find(filter)
                .SortByDescending(s => s.DataCriacao)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<long> GetTotalAsync()
        {
            return await _solicitacoesCollection.CountDocumentsAsync(FilterDefinition<SolicitacaoServico>.Empty);
        }

        public async Task<SolicitacaoServico> GetByIdAsync(string id)
        {
            return await _solicitacoesCollection.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(SolicitacaoServico solicitacao, CancellationToken cancellationToken)
        {
            var filter = Builders<SolicitacaoServico>.Filter.Eq(s => s.Id, solicitacao.Id);
            var update = Builders<SolicitacaoServico>.Update
                .Set(s => s.ClienteId, solicitacao.ClienteId)
                .Set(s => s.QuantidadeVolumes, solicitacao.QuantidadeVolumes)
                .Set(s => s.Destinatario, solicitacao.Destinatario)
                .Set(s => s.CidadeDestinatario, solicitacao.CidadeDestinatario)
                .Set(s => s.ValorFrete, solicitacao.ValorFrete)
                .Set(s => s.NotasFiscais, solicitacao.NotasFiscais);

            await _solicitacoesCollection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        }

        public async Task DeleteAsync(string id)
        {
            await _solicitacoesCollection.DeleteOneAsync(s => s.Id == id);
        }
    }
}

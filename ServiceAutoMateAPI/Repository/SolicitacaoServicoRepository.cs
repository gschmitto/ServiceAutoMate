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

            var solicitacoes = await _solicitacoesCollection
                .Aggregate()
                .Match(filter)
                .Project(solicitacao => new
                {
                    solicitacao.Id,
                    solicitacao.ClienteId,
                    solicitacao.Destinatario,
                    solicitacao.CidadeDestinatario,
                    solicitacao.QuantidadeVolumes,
                    solicitacao.ValorFrete,
                    solicitacao.NotasFiscais,
                    solicitacao.DataCriacao,
                    solicitacao.DataEdicao,
                    DataOrdenada = solicitacao.DataEdicao ?? solicitacao.DataCriacao
                })
                .SortByDescending(solicitacao => solicitacao.DataOrdenada)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return solicitacoes.Select(solicitacao => new SolicitacaoServico
            {
                Id = solicitacao.Id,
                ClienteId = solicitacao.ClienteId,
                Destinatario = solicitacao.Destinatario,
                CidadeDestinatario = solicitacao.CidadeDestinatario,
                QuantidadeVolumes = solicitacao.QuantidadeVolumes,
                ValorFrete = solicitacao.ValorFrete,
                NotasFiscais = solicitacao.NotasFiscais,
                DataCriacao = solicitacao.DataCriacao,
                DataEdicao = solicitacao.DataEdicao,
            });
        }

        public async Task<long> GetTotalAsync(string? clienteId, DateTime? dataInicio, DateTime? dataFim)
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
        
            return await _solicitacoesCollection.CountDocumentsAsync(filter);
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

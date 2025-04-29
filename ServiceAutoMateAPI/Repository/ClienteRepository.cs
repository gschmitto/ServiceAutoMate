using Microsoft.EntityFrameworkCore;
using ServiceAutoMateAPI.Data;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Repository
{
    public class ClienteRepository(AppDbContext context) : IClienteRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Cliente> AddAsync(Cliente cliente, CancellationToken cancellationToken)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync(cancellationToken);
            foreach (var fretePorCidade in cliente.FretesPorCidade!)
            {
                _context.FretesPorCidade.Add(fretePorCidade);
            }
            return cliente;
        }

        public async Task<IEnumerable<Cliente>> GetPaginationAsync(int page, int pageSize, string? nome = null)
        {
            var query = _context.Clientes
                .Include(c => c.FretesPorCidade)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(nome))
            {
                query = query.Where(c => EF.Functions.ILike(c.NomeEmpresa, $"%{nome}%"));
            }

            return await query
                .OrderByDescending(c => c.DataEdicao ?? c.DataCriacao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<long> GetTotalAsync()
        {
            return await _context.Clientes.LongCountAsync();
        }

        public async Task<Cliente?> GetByDetailsAsync(string nomeEmpresa, string endereco, string cidade, Guid? id)
        {
            return await _context.Clientes
                .AsNoTracking()
                .Include(c => c.FretesPorCidade)
                .FirstOrDefaultAsync(c =>
                    c.NomeEmpresa == nomeEmpresa &&
                    c.Endereco == endereco &&
                    c.Cidade == cidade &&
                    (!id.HasValue || c.Id != id.Value));
        }

        public async Task<Cliente?> GetByIdAsync(Guid id)
        {
            return await _context.Clientes
                .Include(c => c.FretesPorCidade)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task UpdateAsync(Cliente cliente, CancellationToken cancellationToken)
        {
            var clienteExistente = await _context.Clientes.FindAsync([cliente.Id], cancellationToken: cancellationToken);
            var fretesPorCidadeCliente = cliente.FretesPorCidade ?? [];

            if (clienteExistente != null)
            {
                var fretesPorCidadeExistente = await _context.FretesPorCidade.Where(f => f.ClienteId == cliente.Id).ToListAsync(cancellationToken: cancellationToken);
                foreach (var fretePorCidade in fretesPorCidadeCliente)
                {
                    var fretePorCidadeExistente = fretesPorCidadeExistente.FirstOrDefault(f => f.Id == fretePorCidade.Id);
                    if (fretePorCidadeExistente != null)
                    {
                        fretePorCidadeExistente.Cidade = fretePorCidade.Cidade;
                        fretePorCidadeExistente.Valor = fretePorCidade.Valor;
                    }
                    else
                    {
                        _context.FretesPorCidade.Add(fretePorCidade);
                    }
                }

                var fretesPorCidadeParaRemover = fretesPorCidadeExistente.Where(f => !fretesPorCidadeCliente.Any(c => c.Id == f.Id));
                _context.FretesPorCidade.RemoveRange(fretesPorCidadeParaRemover);

                _context.Clientes.Update(cliente);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente != null)
            {
                var fretesPorCidade = await _context.FretesPorCidade.Where(f => f.ClienteId == id).ToListAsync();
                _context.FretesPorCidade.RemoveRange(fretesPorCidade);
                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
            }
        }
    }
}

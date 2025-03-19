using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.Clientes
{
    public class ObterTodosClientesQueryHandler(IClienteRepository clienteRepository) : IRequestHandler<ObterTodosClientesQuery, PagedResult<Cliente>>
    {
        private readonly IClienteRepository _clienteRepository = clienteRepository;

        public async Task<PagedResult<Cliente>> Handle(ObterTodosClientesQuery request, CancellationToken cancellationToken)
        {
            var totalCount = await _clienteRepository.GetTotalAsync();

            var clientes = await _clienteRepository.GetPaginationAsync(request.Page, request.PageSize);

            return new PagedResult<Cliente>(clientes, totalCount, request.Page, request.PageSize);
        }
    }
}

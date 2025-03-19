using MediatR;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.Queries
{
    public class ObterTodosClientesQuery(int page, int pageSize) : IRequest<PagedResult<Cliente>>
    {
        public int Page { get; set; } = page;
        public int PageSize { get; set; } = pageSize;
    }
}
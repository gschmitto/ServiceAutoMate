using MediatR;

namespace ServiceAutoMateAPI.Commands.Clientes
{
    public class ExcluirClienteCommand : IRequest<bool>
    {
        public required string Id { get; set; }
    }
}

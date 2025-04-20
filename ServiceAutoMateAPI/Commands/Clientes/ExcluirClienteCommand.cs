using MediatR;

namespace ServiceAutoMateAPI.Commands.Clientes
{
    public class ExcluirClienteCommand : IRequest<bool>
    {
        public required Guid Id { get; set; }
    }
}

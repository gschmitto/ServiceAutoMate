using MediatR;
using ServiceAutoMateAPI.Commands.Clientes;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.Clientes
{
    public class ExcluirClienteCommandHandler(IClienteRepository clienteRepository) : IRequestHandler<ExcluirClienteCommand, bool>
    {
        private readonly IClienteRepository _clienteRepository = clienteRepository;

        public async Task<bool> Handle(ExcluirClienteCommand request, CancellationToken cancellationToken)
        {
            var clienteExistente = await _clienteRepository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Cliente não encontrado.");

            await _clienteRepository.DeleteAsync(clienteExistente.Id);
            return true;
        }
    }
}

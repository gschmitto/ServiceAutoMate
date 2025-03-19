using MediatR;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Repository;
using FluentValidation;
using ServiceAutoMateAPI.Commands.Clientes;

namespace ServiceAutoMateAPI.Handlers.Clientes
{
    public class CriarClienteCommandHandler(
        IClienteRepository clienteRepository,
        IValidator<CriarClienteCommand> criarClienteCommandValidator) : IRequestHandler<CriarClienteCommand, Cliente>
    {
        private readonly IClienteRepository _clienteRepository = clienteRepository;
        private readonly IValidator<CriarClienteCommand> _criarClienteCommandValidator = criarClienteCommandValidator;

        public async Task<Cliente> Handle(CriarClienteCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _criarClienteCommandValidator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var cliente = new Cliente
            {
                Id = Guid.NewGuid().ToString(),
                NomeEmpresa = request.NomeEmpresa,
                Endereco = request.Endereco,
                Cidade = request.Cidade,
                ValorFretePorCidade = request.ValorFretePorCidade,
                ValorMaximoNota = request.ValorMaximoNota,
                PorcentagemCobranca = request.PorcentagemCobranca
            };

            var clienteDuplicado = await _clienteRepository.GetByDetailsAsync(
                request.NomeEmpresa,
                request.Endereco,
                request.Cidade,
                null);

            if (clienteDuplicado != null)
            {
                throw new InvalidOperationException("Já existe uma empresa com o mesmo nome, endereço e cidade.");
            }

            var clienteCriado = await _clienteRepository.AddAsync(cliente, cancellationToken);
            return clienteCriado;
        }
    }
}

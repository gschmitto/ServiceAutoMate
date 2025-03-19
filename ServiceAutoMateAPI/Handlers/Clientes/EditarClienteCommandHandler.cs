using FluentValidation;
using MediatR;
using ServiceAutoMateAPI.Commands.Clientes;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.Clientes
{
    public class EditarClienteCommandHandler(
        IClienteRepository clienteRepository,
        IValidator<EditarClienteCommand> editarClienteCommandValidator) : IRequestHandler<EditarClienteCommand, Cliente>
    {
        private readonly IClienteRepository _clienteRepository = clienteRepository;
        private readonly IValidator<EditarClienteCommand> _editarClienteCommandValidator = editarClienteCommandValidator;

        public async Task<Cliente> Handle(EditarClienteCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _editarClienteCommandValidator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var clienteExistente = await _clienteRepository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Cliente não encontrado.");

            clienteExistente.NomeEmpresa = request.NomeEmpresa;
            clienteExistente.Endereco = request.Endereco;
            clienteExistente.Cidade = request.Cidade;
            clienteExistente.ValorFretePorCidade = request.ValorFretePorCidade;
            clienteExistente.ValorMaximoNota = request.ValorMaximoNota;
            clienteExistente.PorcentagemCobranca = request.PorcentagemCobranca;

            var clienteDuplicado = await _clienteRepository.GetByDetailsAsync(
                request.NomeEmpresa,
                request.Endereco,
                request.Cidade,
                request.Id);

            if (clienteDuplicado != null)
            {
                throw new InvalidOperationException("Já existe uma empresa com o mesmo nome, endereço e cidade.");
            }

            await _clienteRepository.UpdateAsync(clienteExistente, cancellationToken);

            return clienteExistente;
        }
    }
}

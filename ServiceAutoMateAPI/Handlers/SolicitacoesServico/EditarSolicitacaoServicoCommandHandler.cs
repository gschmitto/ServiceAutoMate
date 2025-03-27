using FluentValidation;
using MediatR;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class EditarSolicitacaoServicoCommandHandler(
        ISolicitacaoServicoRepository solicitacaoServicoRepository,
        IClienteRepository clienteRepository,
        IValidator<EditarSolicitacaoServicoCommand> editarSolicitacaoServicoCommandValidator) : IRequestHandler<EditarSolicitacaoServicoCommand, SolicitacaoServico>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;
        private readonly IClienteRepository _clienteRepository = clienteRepository;
        private readonly IValidator<EditarSolicitacaoServicoCommand> _editarSolicitacaoServicoCommandValidator = editarSolicitacaoServicoCommandValidator;

        public async Task<SolicitacaoServico> Handle(EditarSolicitacaoServicoCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _editarSolicitacaoServicoCommandValidator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var solicitacaoExistente = await _solicitacaoServicoRepository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Solicitação de serviço não encontrada.");

            solicitacaoExistente.QuantidadeVolumes = request.QuantidadeVolumes;
            solicitacaoExistente.Destinatario = request.Destinatario;
            solicitacaoExistente.CidadeDestinatario = request.CidadeDestinatario;
            solicitacaoExistente.NotasFiscais = request.NotasFiscais;
            solicitacaoExistente.DataEdicao = DateTime.UtcNow;

            var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId)
                ?? throw new KeyNotFoundException("Cliente não encontrado.");

            if (cliente != null)
            {
                solicitacaoExistente.ValorFrete = cliente.GetValorFretePorCidade(request.CidadeDestinatario, request.CalcularTotalNotas());
            }

            await _solicitacaoServicoRepository.UpdateAsync(solicitacaoExistente, cancellationToken);

            return solicitacaoExistente;
        }
    }
}

using FluentValidation;
using MediatR;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class CriarSolicitacaoServicoCommandHandler(
        ISolicitacaoServicoRepository solicitacaoServicoRepository,
        IClienteRepository clienteRepository,
        IValidator<CriarSolicitacaoServicoCommand> criarSolicitacaoServicoCommandValidator) : IRequestHandler<CriarSolicitacaoServicoCommand, SolicitacaoServico>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;
        private readonly IClienteRepository _clienteRepository = clienteRepository;
        private readonly IValidator<CriarSolicitacaoServicoCommand> _criarSolicitacaoServicoCommandValidator = criarSolicitacaoServicoCommandValidator;

        public async Task<SolicitacaoServico> Handle(
            CriarSolicitacaoServicoCommand request,
            CancellationToken cancellationToken)
        {
            var validationResult = await _criarSolicitacaoServicoCommandValidator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId)
                ?? throw new KeyNotFoundException("Cliente não encontrado.");

            var valorFrete = cliente.GetFretesPorCidade(request.CidadeDestinatario, request.CalcularTotalNotas());

            var solicitacaoServico = new SolicitacaoServico
            {
                Id = Guid.NewGuid(),
                ClienteId = request.ClienteId,
                QuantidadeVolumes = request.QuantidadeVolumes,
                Destinatario = request.Destinatario,
                CidadeDestinatario = request.CidadeDestinatario,
                ValorFrete = valorFrete,
                NotasFiscais = request.NotasFiscais,
                DataCriacao = DateTime.UtcNow
            };

            await _solicitacaoServicoRepository.AddAsync(solicitacaoServico, cancellationToken);

            return solicitacaoServico;
        }
    }
}

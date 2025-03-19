using MediatR;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.Repository;

namespace ServiceAutoMateAPI.Handlers.SolicitacoesServico
{
    public class ExcluirSolicitacaoServicoCommandHandler(ISolicitacaoServicoRepository solicitacaoServicoRepository)
        : IRequestHandler<ExcluirSolicitacaoServicoCommand, bool>
    {
        private readonly ISolicitacaoServicoRepository _solicitacaoServicoRepository = solicitacaoServicoRepository;

        public async Task<bool> Handle(ExcluirSolicitacaoServicoCommand request, CancellationToken cancellationToken)
        {
            var solicitacaoExistente = await _solicitacaoServicoRepository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Solicitação de serviço não encontrada.");

            await _solicitacaoServicoRepository.DeleteAsync(solicitacaoExistente.Id);
            return true;
        }
    }
}

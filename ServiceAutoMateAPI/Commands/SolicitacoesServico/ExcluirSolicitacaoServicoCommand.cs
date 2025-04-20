using MediatR;

namespace ServiceAutoMateAPI.Commands.SolicitacoesServico
{
    public class ExcluirSolicitacaoServicoCommand : IRequest<bool>
    {
        public required Guid Id { get; set; }
    }
}

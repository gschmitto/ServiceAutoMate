using FluentValidation;
using ServiceAutoMateAPI.Models.Validators;

namespace ServiceAutoMateAPI.Commands.SolicitacoesServico.Validators
{
    public class CriarSolicitacaoServicoCommandValidator : AbstractValidator<CriarSolicitacaoServicoCommand>
    {
        public CriarSolicitacaoServicoCommandValidator()
        {
            ClassLevelCascadeMode = CascadeMode.Continue;

            RuleFor(command => command.ClienteId)
                .NotEmpty().WithMessage("O cliente ID não pode ser vazio.");

            RuleFor(command => command.QuantidadeVolumes)
                .GreaterThanOrEqualTo(1).WithMessage("A quantidade de volumes deve ser maior ou igual a 1.");

            RuleFor(command => command.Destinatario)
                .NotEmpty().WithMessage("O destinatário não pode ser vazio.")
                .Length(3, 100).WithMessage("O destinatário deve ter entre 3 e 100 caracteres.");

            RuleFor(command => command.CidadeDestinatario)
                .NotEmpty().WithMessage("A cidade do destinatário não pode ser vazia.")
                .Length(3, 100).WithMessage("A cidade do destinatário deve ter entre 3 e 100 caracteres.");

            RuleForEach(command => command.NotasFiscais)
                .NotEmpty().WithMessage("A lista de notas fiscais não pode ser vazia.")
                .SetValidator(new DadosNotaFiscalValidator());
        }
    }
}
using FluentValidation;
using ServiceAutoMateAPI.Models.Validators;

namespace ServiceAutoMateAPI.Commands.Clientes.Validators
{
    public class EditarClienteCommandValidator : AbstractValidator<EditarClienteCommand>
    {
        public EditarClienteCommandValidator()
        {
            ClassLevelCascadeMode = CascadeMode.Continue;

            RuleFor(command => command.Id)
                .NotEmpty().WithMessage("O ID do cliente não pode ser vazio.");

            RuleFor(command => command.NomeEmpresa)
                .NotEmpty().WithMessage("O nome da empresa não pode ser vazio.")
                .Length(3, 100).WithMessage("O nome da empresa deve ter entre 3 e 100 caracteres.");

            RuleFor(command => command.Endereco)
                .NotEmpty().WithMessage("O endereço não pode ser vazio.")
                .Length(3, 150).WithMessage("O endereço deve ter entre 3 e 150 caracteres.");

            RuleFor(command => command.Cidade)
                .NotEmpty().WithMessage("A cidade não pode ser vazia.")
                .Length(3, 100).WithMessage("A cidade deve ter entre 3 e 100 caracteres.");

            RuleForEach(command => command.FretesPorCidade)
                .SetValidator(new FretePorCidadeValidator());

            RuleFor(command => command.ValorMaximoNota)
                .GreaterThan(0).WithMessage("O valor máximo da nota deve ser maior que zero.");

            RuleFor(command => command.PorcentagemCobranca)
                .GreaterThan(0).WithMessage("A porcentagem de cobrança deve ser maior que zero.");
        }
    }
}

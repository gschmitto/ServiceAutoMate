using FluentValidation;

namespace ServiceAutoMateAPI.Models.Validators
{
    public class FretePorCidadeValidator : AbstractValidator<FretePorCidade>
    {
        public FretePorCidadeValidator()
        {
            ClassLevelCascadeMode = CascadeMode.Continue;

            RuleFor(cliente => cliente.Cidade)
                .NotEmpty().WithMessage("A cidade não pode ser vazia.")
                .Length(3, 100).WithMessage("A cidade deve ter entre 3 e 100 caracteres.");

            RuleFor(cliente => cliente.Valor)
                .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");
        }
    }
}
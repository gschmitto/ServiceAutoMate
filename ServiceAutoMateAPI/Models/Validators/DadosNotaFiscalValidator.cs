using FluentValidation;

namespace ServiceAutoMateAPI.Models.Validators
{
    public class DadosNotaFiscalValidator : AbstractValidator<DadosNotaFiscal>
    {
        public DadosNotaFiscalValidator()
        {
            ClassLevelCascadeMode = CascadeMode.Continue;

            RuleFor(nota => nota.NumeroNota)
                .NotEmpty().WithMessage("O número da nota fiscal não pode ser vazio.")
                .Length(1, 20).WithMessage("O número da nota fiscal deve ter entre 1 e 20 caracteres.");

            RuleFor(nota => nota.ValorNota)
                .GreaterThan(0).WithMessage("O valor da nota fiscal deve ser maior que zero.");
        }
    }
}
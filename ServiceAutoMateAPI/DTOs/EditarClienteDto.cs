using MediatR;
using ServiceAutoMateAPI.Models;

namespace ServiceAutoMateAPI.DTOs
{
    public class EditarClienteDto : IRequest<Cliente>
    {
        public required string NomeEmpresa { get; set; }
        public required string Endereco { get; set; }
        public required string Cidade { get; set; }
        public List<FretePorCidade>? FretesPorCidade { get; set; }
        public decimal ValorMaximoNota { get; set; }
        public decimal PorcentagemCobranca { get; set; }
    }
}

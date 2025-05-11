using MediatR;
using Microsoft.AspNetCore.Mvc;
using ServiceAutoMateAPI.Commands.SolicitacoesServico;
using ServiceAutoMateAPI.DTOs;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Responses;
using ServiceAutoMateAPI.Responses.Errors;

namespace ServiceAutoMateAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SolicitacaoServicoController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;

        [HttpPost]
        [ProducesResponseType(typeof(SolicitacaoServico), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(List<ErroBadRequestResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CriarSolicitacao([FromBody] CriarSolicitacaoServicoCommand command)
        {
            var solicitacaoCriada = await _mediator.Send(command);
            return CreatedAtAction(null, new { id = solicitacaoCriada.Id }, solicitacaoCriada);
        }

        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<SolicitacaoServicoResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterSolicitacoes(
            [FromQuery] Guid? clienteId,
            [FromQuery] DateTime? dataInicial,
            [FromQuery] DateTime? dataFinal,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new ObterSolicitacoesServicoQuery(
                clienteId,
                dataInicial,
                dataFinal,
                page,
                pageSize);

            var solicitacoes = await _mediator.Send(query);
            return Ok(solicitacoes);
        }

        [HttpPut("{id}/{clienteId}")]
        [ProducesResponseType(typeof(SolicitacaoServico), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(List<ErroBadRequestResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarSolicitacao(
            [FromRoute] Guid id,
            [FromRoute] Guid clienteId,
            [FromBody] EditarSolicitacaoServicoDto dto)
        {
            var command = new EditarSolicitacaoServicoCommand()
            {
                Id = id,
                ClienteId = clienteId,
                QuantidadeVolumes = dto.QuantidadeVolumes,
                Destinatario = dto.Destinatario,
                CidadeDestinatario = dto.CidadeDestinatario,
                NotasFiscais = dto.NotasFiscais
            };

            var solicitacaoAtualizada = await _mediator.Send(command);
            return Ok(solicitacaoAtualizada);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(SucessoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirSolicitacao(Guid id)
        {
            await _mediator.Send(new ExcluirSolicitacaoServicoCommand { Id = id });
            return NoContent();
        }
    }
}

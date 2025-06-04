using MediatR;
using Microsoft.AspNetCore.Mvc;
using ServiceAutoMateAPI.Commands.Monitoramento;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Responses;
using ServiceAutoMateAPI.Responses.Errors;

namespace ServiceAutoMateAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitoramentoController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;

        [HttpGet("previsao")]
        [ProducesResponseType(typeof(List<PrevisaoResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterPrevisao([FromQuery] int quantidadeMeses = 1)
        {
            var query = new ObterPrevisaoFaturamentoQuery { QuantidadeMeses = quantidadeMeses };
            var previsao = await _mediator.Send(query);
            return Ok(previsao);
        }

        [HttpPost("treinar-modelo")]
        public async Task<IActionResult> TreinarModelo(CancellationToken cancellationToken)
        {
            var resultado = await _mediator.Send(new TreinarModeloPrevisaoCommand(), cancellationToken);
            return Ok(resultado);
        }
    }
}
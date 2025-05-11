using MediatR;
using Microsoft.AspNetCore.Mvc;
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
        [ProducesResponseType(typeof(PrevisaoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterPrevisao()
        {
            var query = new ObterPrevisaoFaturamentoQuery();
            var previsao = await _mediator.Send(query);
            return Ok(previsao);
        }
    }
}
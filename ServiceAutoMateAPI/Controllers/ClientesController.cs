using MediatR;
using Microsoft.AspNetCore.Mvc;
using ServiceAutoMateAPI.Commands.Clientes;
using ServiceAutoMateAPI.DTOs;
using ServiceAutoMateAPI.Models;
using ServiceAutoMateAPI.Queries;
using ServiceAutoMateAPI.Responses;
using ServiceAutoMateAPI.Responses.Errors;

namespace ServiceAutoMateAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;

        /// <summary>
        /// Adiciona um novo cliente.
        /// </summary>
        /// <param name="command">O comando para criar o cliente.</param>
        /// <returns>O cliente criado.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(Cliente), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(List<ErroBadRequestResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AdicionarCliente([FromBody] CriarClienteCommand command)
        {
            var clienteCriado = await _mediator.Send(command);
            return CreatedAtAction(null, new { id = clienteCriado.Id }, clienteCriado);
        }

        /// <summary>
        /// Obtém todos os clientes com paginação.
        /// </summary>
        /// <param name="nome">Nome do cliente.</param>
        /// <param name="page">Número da página.</param>
        /// <param name="pageSize">Número de itens por página.</param>
        /// <returns>Lista de clientes paginada.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<Cliente>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterClientes(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            var query = new ObterTodosClientesQuery(page, pageSize, nome);
            var clientesPaginados = await _mediator.Send(query);
            return Ok(clientesPaginados);
        }

        /// <summary>
        /// Edita um cliente existente.
        /// </summary>
        /// <param name="id">ID do cliente a ser editado.</param>
        /// <param name="command">O comando contendo as novas informações do cliente.</param>
        /// <returns>O cliente atualizado.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Cliente), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(List<ErroBadRequestResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarCliente(
            [FromRoute] string id,
            [FromBody] EditarClienteDto dto)
        {
            EditarClienteCommand editarClienteCommand = new()
            {
                Id = id,
                NomeEmpresa = dto.NomeEmpresa,
                Endereco = dto.Endereco,
                Cidade = dto.Cidade,
                ValorFretePorCidade = dto.ValorFretePorCidade,
                ValorMaximoNota = dto.ValorMaximoNota,
                PorcentagemCobranca = dto.PorcentagemCobranca
            };
            var clienteAtualizado = await _mediator.Send(editarClienteCommand);
            return Ok(clienteAtualizado);
        }

        /// <summary>
        /// Exclui um cliente.
        /// </summary>
        /// <param name="id">ID do cliente a ser excluído.</param>
        /// <returns>Um objeto com uma mensagem informando que o cliente foi excluído.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(SucessoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCliente(string id)
        {
            var command = new ExcluirClienteCommand { Id = id };
            await _mediator.Send(command);
            return Ok(new SucessoResponse { Mensagem = "Cliente excluído com sucesso." });
        }
    }
}

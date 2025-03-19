using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ServiceAutoMateAPI.Responses.Errors;

namespace ServiceAutoMateAPI.Middleware
{
    public class CustomValidationExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is FluentValidation.ValidationException validationException)
            {
                var errors = validationException.Errors
                    .Select(e => new ErroBadRequestResponse
                    {
                        Parametro = e.PropertyName,
                        Detalhes = e.ErrorMessage
                    })
                    .ToList();

                context.Result = new BadRequestObjectResult(errors);
                context.ExceptionHandled = true;
            }
            else if (context.Exception is KeyNotFoundException keyNotFoundException)
            {
                var errorResponse = new ErroResponse
                {
                    Mensagem = "Dado não encontrado.",
                    Detalhes = keyNotFoundException.Message
                };

                context.Result = new ObjectResult(errorResponse)
                {
                    StatusCode = StatusCodes.Status404NotFound
                };
                context.ExceptionHandled = true;
            }
            else if (context.Exception is InvalidOperationException invalidOperationException)
            {
                var errorResponse = new ErroResponse
                {
                    Mensagem = "Conflito de dados.",
                    Detalhes = invalidOperationException.Message
                };

                context.Result = new ObjectResult(errorResponse)
                {
                    StatusCode = StatusCodes.Status409Conflict
                };
                context.ExceptionHandled = true;
            }
            else
            {
                var errorResponse = new ErroResponse
                {
                    Mensagem = "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
                    Detalhes = context.Exception.Message
                };

                context.Result = new ObjectResult(errorResponse)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
                context.ExceptionHandled = true;
            }
        }
    }
}
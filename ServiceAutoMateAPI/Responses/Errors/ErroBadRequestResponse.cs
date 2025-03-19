namespace ServiceAutoMateAPI.Responses.Errors
{
    public class ErroBadRequestResponse
    {
        public required string Parametro { get; set; }
        public required string Detalhes { get; set; }
    }
}
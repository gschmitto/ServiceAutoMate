namespace ServiceAutoMateAPI.Commands.Clientes
{
    public class EditarClienteCommand : ClienteCommand
    {
        public required Guid Id { get; set; }
    }
}

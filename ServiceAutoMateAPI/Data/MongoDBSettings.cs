namespace ServiceAutoMateAPI.Data
{
    public class MongoDBSettings
    {
        public required string ConnectionString { get; set; }
        public required string DatabaseName { get; set; }
        public required string CollectionName { get; set; }
        public int MaxConnectionPoolSize { get; set; }
        public bool UseAuthentication { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}

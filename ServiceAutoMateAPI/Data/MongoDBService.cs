using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ServiceAutoMateAPI.Data
{
    public class MongoDBService
    {
        private readonly IMongoDatabase _database;

        public MongoDBService(IOptions<MongoDBSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            _database = mongoClient.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }
}

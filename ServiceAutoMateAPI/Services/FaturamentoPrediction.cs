using Microsoft.ML.Data;

namespace ServiceAutoMateAPI.Services
{
    public class FaturamentoPrediction
    {
        [ColumnName("Score")]
        public float PrevisaoFrete { get; set; }
    }
}
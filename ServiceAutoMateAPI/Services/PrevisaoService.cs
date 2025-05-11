using Microsoft.ML;
using ServiceAutoMateAPI.DTOs;
using ServiceAutoMateAPI.Responses;

namespace ServiceAutoMateAPI.Services
{
    public class PrevisaoService
    {
        private readonly MLContext _mlContext;

        public PrevisaoService()
        {
            _mlContext = new MLContext();
        }

        public List<PrevisaoResponse> CalcularPrevisao(List<PrevisaoFaturamentoDto> dadosHistoricos, int quantidadeMeses)
        {
            if (dadosHistoricos.Count < 3)
                throw new Exception("Não há dados suficientes para previsão.");

            // Prepara os dados
            var data = dadosHistoricos
                .Select(d => new FaturamentoData
                {
                    Mes = d.Mes,
                    Ano = d.Ano,
                    TotalFrete = (float)d.TotalFrete
                }).ToList();

            var trainingData = _mlContext.Data.LoadFromEnumerable(data);

            // Define pipeline de regressão
            var pipeline = _mlContext.Transforms
                .Concatenate("Features", nameof(FaturamentoData.Mes), nameof(FaturamentoData.Ano))
                .Append(_mlContext.Regression.Trainers.Sdca(labelColumnName: "TotalFrete", maximumNumberOfIterations: 100));

            // Treina o modelo
            var model = pipeline.Fit(trainingData);
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<FaturamentoData, FaturamentoPrediction>(model);

            var previsoes = new List<PrevisaoResponse>();
            var ultimo = dadosHistoricos.Last();
            int mes = ultimo.Mes;
            int ano = ultimo.Ano;
            
            for (int i = 0; i < quantidadeMeses; i++)
            {
                mes++;
                if (mes > 12)
                {
                    mes = 1;
                    ano++;
                }

                var prediction = predictionEngine.Predict(new FaturamentoData
                {
                    Mes = mes,
                    Ano = ano
                });

                previsoes.Add(new PrevisaoResponse
                {
                    Mes = mes,
                    Ano = ano,
                    PrevisaoFrete = (float)Math.Round(prediction.PrevisaoFrete, 2)
                });
            }

            return previsoes;
        }
    }
}
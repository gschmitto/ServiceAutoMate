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

        public PrevisaoResponse CalcularPrevisao(List<PrevisaoFaturamentoDto> dadosHistoricos)
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

            // Descobre próximo mês/ano
            var ultimo = dadosHistoricos.Last();
            var proximoMes = ultimo.Mes == 12 ? 1 : ultimo.Mes + 1;
            var proximoAno = ultimo.Mes == 12 ? ultimo.Ano + 1 : ultimo.Ano;

            var predictionEngine = _mlContext.Model.CreatePredictionEngine<FaturamentoData, FaturamentoPrediction>(model);

            var prediction = predictionEngine.Predict(new FaturamentoData
            {
                Mes = proximoMes,
                Ano = proximoAno
            });

            return new PrevisaoResponse
            {
                Ano = proximoAno,
                Mes = proximoMes,
                PrevisaoFrete = (float)Math.Round(prediction.PrevisaoFrete, 2)
            };
        }
    }
}
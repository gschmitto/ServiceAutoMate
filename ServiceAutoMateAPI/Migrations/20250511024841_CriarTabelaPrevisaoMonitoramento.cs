using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ServiceAutoMateAPI.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaPrevisaoMonitoramento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrevisoesMonitoramento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Mes = table.Column<int>(type: "integer", nullable: false),
                    Ano = table.Column<int>(type: "integer", nullable: false),
                    PrevisaoFrete = table.Column<float>(type: "real", nullable: false),
                    DataRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrevisoesMonitoramento", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrevisoesMonitoramento_Mes_Ano",
                table: "PrevisoesMonitoramento",
                columns: ["Mes", "Ano"],
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrevisoesMonitoramento");
        }
    }
}

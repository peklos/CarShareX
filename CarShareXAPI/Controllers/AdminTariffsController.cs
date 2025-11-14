using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/tariffs")]
[ApiController]
public class AdminTariffsController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminTariffsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/tariffs
    [HttpGet]
    public async Task<IActionResult> GetAllTariffs()
    {
        var tariffs = await _context.Tariffs.ToListAsync();
        return Ok(tariffs);
    }

    // POST: api/admin/tariffs
    [HttpPost]
    public async Task<IActionResult> CreateTariff([FromBody] TariffCreateDto tariffData)
    {
        var newTariff = new Tariff
        {
            Name = tariffData.Name,
            PricePerMinute = tariffData.PricePerMinute,
            PricePerHour = tariffData.PricePerHour
        };

        _context.Tariffs.Add(newTariff);
        await _context.SaveChangesAsync();

        return Ok(newTariff);
    }

    // PATCH: api/admin/tariffs/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateTariff(int id, [FromBody] TariffUpdateDto tariffData)
    {
        var tariff = await _context.Tariffs
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tariff == null)
        {
            return NotFound(new { detail = "Тариф не найден" });
        }

        if (!string.IsNullOrEmpty(tariffData.Name))
            tariff.Name = tariffData.Name;

        if (tariffData.PricePerMinute.HasValue)
            tariff.PricePerMinute = tariffData.PricePerMinute;

        if (tariffData.PricePerHour.HasValue)
            tariff.PricePerHour = tariffData.PricePerHour;

        await _context.SaveChangesAsync();

        return Ok(tariff);
    }

    // DELETE: api/admin/tariffs/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTariff(int id)
    {
        var tariff = await _context.Tariffs
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tariff == null)
        {
            return NotFound(new { detail = "Тариф не найден" });
        }

        _context.Tariffs.Remove(tariff);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Тариф удален", tariff_id = id });
    }
}

// DTOs
public class TariffCreateDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("price_per_minute")]
    public double?? PricePerMinute { get; set; }

    [JsonPropertyName("price_per_hour")]
    public double?? PricePerHour { get; set; }
}

public class TariffUpdateDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("price_per_minute")]
    public double?? PricePerMinute { get; set; }

    [JsonPropertyName("price_per_hour")]
    public double?? PricePerHour { get; set; }
}

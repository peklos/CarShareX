using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;

namespace CarShareXAPI.Controllers;

[Route("api/tariffs")]
[ApiController]
public class TariffsController : ControllerBase
{
    private readonly CarShareContext _context;

    public TariffsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/tariffs
    [HttpGet]
    public async Task<IActionResult> GetAllTariffs()
    {
        var tariffs = await _context.Tariffs.ToListAsync();
        return Ok(tariffs);
    }

    // GET: api/tariffs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTariff(int id)
    {
        var tariff = await _context.Tariffs
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tariff == null)
        {
            return NotFound(new { detail = "Тариф не найден" });
        }

        return Ok(tariff);
    }
}

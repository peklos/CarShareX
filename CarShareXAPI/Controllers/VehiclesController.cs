using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;

namespace CarShareXAPI.Controllers;

[Route("api/vehicles")]
[ApiController]
public class VehiclesController : ControllerBase
{
    private readonly CarShareContext _context;

    public VehiclesController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/vehicles
    [HttpGet]
    public async Task<IActionResult> GetAvailableVehicles(
        [FromQuery(Name = "vehicle_type")] string? vehicleType = null,
        [FromQuery(Name = "tariff_id")] int? tariffId = null,
        [FromQuery(Name = "parking_zone_id")] int? parkingZoneId = null,
        [FromQuery] string? brand = null,
        [FromQuery] string? status = "available")
    {
        var query = _context.Vehicles
            .Include(v => v.ParkingZone)
            .Include(v => v.Tariff)
            .AsQueryable();

        // Применяем фильтры
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(v => v.Status == status);
        }

        if (!string.IsNullOrEmpty(vehicleType))
        {
            query = query.Where(v => v.VehicleType == vehicleType);
        }

        if (tariffId.HasValue)
        {
            query = query.Where(v => v.TariffId == tariffId.Value);
        }

        if (parkingZoneId.HasValue)
        {
            query = query.Where(v => v.ParkingZoneId == parkingZoneId.Value);
        }

        if (!string.IsNullOrEmpty(brand))
        {
            query = query.Where(v => EF.Functions.Like(v.Brand, $"%{brand}%"));
        }

        var vehicles = await query.ToListAsync();
        return Ok(vehicles);
    }

    // GET: api/vehicles/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.ParkingZone)
            .Include(v => v.Tariff)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
        {
            return NotFound(new { detail = "Автомобиль не найден" });
        }

        return Ok(vehicle);
    }
}

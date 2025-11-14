using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;

namespace CarShareXAPI.Controllers;

[Route("api/parking-zones")]
[ApiController]
public class ParkingZonesController : ControllerBase
{
    private readonly CarShareContext _context;

    public ParkingZonesController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/parking-zones
    [HttpGet]
    public async Task<IActionResult> GetAllParkingZones()
    {
        var zones = await _context.ParkingZones.ToListAsync();
        return Ok(zones);
    }

    // GET: api/parking-zones/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetParkingZone(int id)
    {
        var zone = await _context.ParkingZones
            .FirstOrDefaultAsync(z => z.Id == id);

        if (zone == null)
        {
            return NotFound(new { detail = "Парковочная зона не найдена" });
        }

        return Ok(zone);
    }
}

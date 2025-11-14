using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/parking-zones")]
[ApiController]
public class AdminParkingController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminParkingController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/parking-zones
    [HttpGet]
    public async Task<IActionResult> GetAllParkingZones()
    {
        var zones = await _context.ParkingZones.ToListAsync();
        return Ok(zones);
    }

    // POST: api/admin/parking-zones
    [HttpPost]
    public async Task<IActionResult> CreateParkingZone([FromBody] ParkingZoneCreateDto zoneData)
    {
        var newZone = new ParkingZone
        {
            Name = zoneData.Name,
            Address = zoneData.Address,
            Capacity = zoneData.Capacity
        };

        _context.ParkingZones.Add(newZone);
        await _context.SaveChangesAsync();

        return Ok(newZone);
    }

    // PATCH: api/admin/parking-zones/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateParkingZone(int id, [FromBody] ParkingZoneUpdateDto zoneData)
    {
        var zone = await _context.ParkingZones
            .FirstOrDefaultAsync(z => z.Id == id);

        if (zone == null)
        {
            return NotFound(new { detail = "Парковка не найдена" });
        }

        if (!string.IsNullOrEmpty(zoneData.Name))
            zone.Name = zoneData.Name;

        if (!string.IsNullOrEmpty(zoneData.Address))
            zone.Address = zoneData.Address;

        if (zoneData.Capacity.HasValue)
            zone.Capacity = zoneData.Capacity.Value;

        await _context.SaveChangesAsync();

        return Ok(zone);
    }

    // DELETE: api/admin/parking-zones/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParkingZone(int id)
    {
        var zone = await _context.ParkingZones
            .FirstOrDefaultAsync(z => z.Id == id);

        if (zone == null)
        {
            return NotFound(new { detail = "Парковка не найдена" });
        }

        _context.ParkingZones.Remove(zone);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Парковка удалена", zone_id = id });
    }
}

// DTOs
public class ParkingZoneCreateDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("address")]
    public string Address { get; set; } = null!;

    [JsonPropertyName("capacity")]
    public int Capacity { get; set; }
}

public class ParkingZoneUpdateDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("address")]
    public string? Address { get; set; }

    [JsonPropertyName("capacity")]
    public int? Capacity { get; set; }
}

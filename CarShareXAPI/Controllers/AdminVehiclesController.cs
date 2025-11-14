using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/vehicles")]
[ApiController]
public class AdminVehiclesController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminVehiclesController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/vehicles
    [HttpGet]
    public async Task<IActionResult> GetAllVehicles()
    {
        var vehicles = await _context.Vehicles
            .Include(v => v.ParkingZone)
            .Include(v => v.Tariff)
            .ToListAsync();

        return Ok(vehicles);
    }

    // POST: api/admin/vehicles
    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] VehicleCreateDto vehicleData)
    {
        // Проверка номера
        var existing = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.LicensePlate == vehicleData.LicensePlate);

        if (existing != null)
        {
            return BadRequest(new { detail = "Автомобиль с таким номером уже существует" });
        }

        var newVehicle = new Vehicle
        {
            LicensePlate = vehicleData.LicensePlate,
            Brand = vehicleData.Brand,
            Model = vehicleData.Model,
            VehicleType = vehicleData.VehicleType,
            Year = vehicleData.Year,
            Color = vehicleData.Color,
            ImageUrl = vehicleData.ImageUrl,
            Description = vehicleData.Description,
            Status = "available",
            ParkingZoneId = vehicleData.ParkingZoneId,
            TariffId = vehicleData.TariffId
        };

        _context.Vehicles.Add(newVehicle);
        await _context.SaveChangesAsync();

        return Ok(newVehicle);
    }

    // PATCH: api/admin/vehicles/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleUpdateDto vehicleData)
    {
        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
        {
            return NotFound(new { detail = "Автомобиль не найден" });
        }

        if (!string.IsNullOrEmpty(vehicleData.Brand))
            vehicle.Brand = vehicleData.Brand;

        if (!string.IsNullOrEmpty(vehicleData.Model))
            vehicle.Model = vehicleData.Model;

        if (!string.IsNullOrEmpty(vehicleData.VehicleType))
            vehicle.VehicleType = vehicleData.VehicleType;

        if (vehicleData.Year.HasValue)
            vehicle.Year = vehicleData.Year.Value;

        if (!string.IsNullOrEmpty(vehicleData.Color))
            vehicle.Color = vehicleData.Color;

        if (!string.IsNullOrEmpty(vehicleData.ImageUrl))
            vehicle.ImageUrl = vehicleData.ImageUrl;

        if (!string.IsNullOrEmpty(vehicleData.Description))
            vehicle.Description = vehicleData.Description;

        if (!string.IsNullOrEmpty(vehicleData.Status))
            vehicle.Status = vehicleData.Status;

        if (vehicleData.ParkingZoneId.HasValue)
            vehicle.ParkingZoneId = vehicleData.ParkingZoneId;

        if (vehicleData.TariffId.HasValue)
            vehicle.TariffId = vehicleData.TariffId;

        await _context.SaveChangesAsync();

        return Ok(vehicle);
    }

    // DELETE: api/admin/vehicles/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
        {
            return NotFound(new { detail = "Автомобиль не найден" });
        }

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Автомобиль удален", vehicle_id = id });
    }
}

// DTOs
public class VehicleCreateDto
{
    [JsonPropertyName("license_plate")]
    public string LicensePlate { get; set; } = null!;

    [JsonPropertyName("brand")]
    public string Brand { get; set; } = null!;

    [JsonPropertyName("model")]
    public string Model { get; set; } = null!;

    [JsonPropertyName("vehicle_type")]
    public string VehicleType { get; set; } = null!;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("color")]
    public string Color { get; set; } = null!;

    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("parking_zone_id")]
    public int? ParkingZoneId { get; set; }

    [JsonPropertyName("tariff_id")]
    public int? TariffId { get; set; }
}

public class VehicleUpdateDto
{
    [JsonPropertyName("brand")]
    public string? Brand { get; set; }

    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("vehicle_type")]
    public string? VehicleType { get; set; }

    [JsonPropertyName("year")]
    public int? Year { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("parking_zone_id")]
    public int? ParkingZoneId { get; set; }

    [JsonPropertyName("tariff_id")]
    public int? TariffId { get; set; }
}

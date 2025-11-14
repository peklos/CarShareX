using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/incidents")]
[ApiController]
public class AdminIncidentsController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminIncidentsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/incidents
    [HttpGet]
    public async Task<IActionResult> GetAllIncidents()
    {
        var incidents = await _context.Incidents
            .Include(i => i.Booking)
            .Include(i => i.Vehicle)
            .ToListAsync();

        return Ok(incidents);
    }

    // POST: api/admin/incidents
    [HttpPost]
    public async Task<IActionResult> CreateIncident([FromBody] IncidentCreateDto incidentData)
    {
        var newIncident = new Incident
        {
            BookingId = incidentData.BookingId,
            VehicleId = incidentData.VehicleId,
            IncidentType = incidentData.IncidentType,
            Description = incidentData.Description,
            Status = "reported"
        };

        _context.Incidents.Add(newIncident);
        await _context.SaveChangesAsync();

        return Ok(newIncident);
    }

    // PATCH: api/admin/incidents/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateIncidentStatus(int id, [FromBody] IncidentUpdateDto updateData)
    {
        var incident = await _context.Incidents
            .FirstOrDefaultAsync(i => i.Id == id);

        if (incident == null)
        {
            return NotFound(new { detail = "Инцидент не найден" });
        }

        incident.Status = updateData.Status;

        await _context.SaveChangesAsync();

        return Ok(incident);
    }
}

// DTOs
public class IncidentCreateDto
{
    [JsonPropertyName("booking_id")]
    public int? BookingId { get; set; }

    [JsonPropertyName("vehicle_id")]
    public int VehicleId { get; set; }

    [JsonPropertyName("incident_type")]
    public string IncidentType { get; set; } = null!;

    [JsonPropertyName("description")]
    public string Description { get; set; } = null!;
}

public class IncidentUpdateDto
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = null!;
}

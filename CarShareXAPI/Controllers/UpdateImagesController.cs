using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;

namespace CarShareXAPI.Controllers;

[Route("api/admin")]
[ApiController]
public class UpdateImagesController : ControllerBase
{
    private readonly CarShareContext _context;

    public UpdateImagesController(CarShareContext context)
    {
        _context = context;
    }

    // POST: api/admin/update-car-images
    [HttpPost("update-car-images")]
    public async Task<IActionResult> UpdateCarImages()
    {
        var carImageUrl = "/car.png";

        var vehicles = await _context.Vehicles.ToListAsync();
        var updatedCount = 0;

        foreach (var vehicle in vehicles)
        {
            vehicle.ImageUrl = carImageUrl;
            updatedCount++;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Обновлено {updatedCount} автомобилей",
            updated_count = updatedCount
        });
    }

    // GET: api/admin/update-images (альтернативный публичный эндпоинт)
    [HttpGet("update-images")]
    public async Task<IActionResult> UpdateCarImagesPublic()
    {
        var carImageUrl = "/car.png";

        var vehicles = await _context.Vehicles.ToListAsync();
        var updatedCount = 0;

        foreach (var vehicle in vehicles)
        {
            vehicle.ImageUrl = carImageUrl;
            updatedCount++;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Обновлено {updatedCount} автомобилей",
            updated_count = updatedCount
        });
    }
}

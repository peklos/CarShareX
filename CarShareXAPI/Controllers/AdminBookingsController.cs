using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;

namespace CarShareXAPI.Controllers;

[Route("api/admin/bookings")]
[ApiController]
public class AdminBookingsController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminBookingsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/bookings
    [HttpGet]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Vehicle)
            .Include(b => b.Tariff)
            .ToListAsync();

        return Ok(bookings);
    }

    // GET: api/admin/bookings/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Vehicle)
            .Include(b => b.Tariff)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(new { detail = "Бронирование не найдено" });
        }

        return Ok(booking);
    }

    // GET: api/admin/bookings/stats/overview
    [HttpGet("stats/overview")]
    public async Task<IActionResult> GetBookingsStats()
    {
        var total = await _context.Bookings.CountAsync();
        var active = await _context.Bookings.CountAsync(b => b.Status == "active");
        var completed = await _context.Bookings.CountAsync(b => b.Status == "completed");
        var pending = await _context.Bookings.CountAsync(b => b.Status == "pending");

        return Ok(new
        {
            total_bookings = total,
            active_bookings = active,
            completed_bookings = completed,
            pending_bookings = pending
        });
    }
}

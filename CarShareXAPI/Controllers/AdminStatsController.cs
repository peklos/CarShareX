using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;

namespace CarShareXAPI.Controllers;

[Route("api/admin/stats")]
[ApiController]
public class AdminStatsController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminStatsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/stats/dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        // Общие показатели
        var totalUsers = await _context.Users.CountAsync();
        var totalVehicles = await _context.Vehicles.CountAsync();
        var totalBookings = await _context.Bookings.CountAsync();

        // Статусы автомобилей
        var availableVehicles = await _context.Vehicles.CountAsync(v => v.Status == "available");
        var inUseVehicles = await _context.Vehicles.CountAsync(v => v.Status == "in_use");
        var maintenanceVehicles = await _context.Vehicles.CountAsync(v => v.Status == "maintenance");

        // Статусы бронирований
        var activeBookings = await _context.Bookings.CountAsync(b => b.Status == "active");
        var completedBookings = await _context.Bookings.CountAsync(b => b.Status == "completed");
        var pendingBookings = await _context.Bookings.CountAsync(b => b.Status == "pending");

        // Общая выручка
        var totalRevenue = await _context.Bookings
            .Where(b => b.Status == "completed")
            .SumAsync(b => (double?)b.TotalCost) ?? 0;

        // Выручка за текущий месяц
        var currentMonthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
        var monthlyRevenue = await _context.Bookings
            .Where(b => b.Status == "completed" && b.EndTime >= currentMonthStart)
            .SumAsync(b => (double?)b.TotalCost) ?? 0;

        // Самые популярные автомобили (топ-5 по количеству бронирований)
        var popularVehicles = await _context.Vehicles
            .Select(v => new
            {
                v.Id,
                v.Brand,
                v.Model,
                v.LicensePlate,
                BookingsCount = _context.Bookings.Count(b => b.VehicleId == v.Id)
            })
            .OrderByDescending(x => x.BookingsCount)
            .Take(5)
            .Select(v => new
            {
                id = v.Id,
                brand = v.Brand,
                model = v.Model,
                license_plate = v.LicensePlate,
                bookings_count = v.BookingsCount
            })
            .ToListAsync();

        // Распределение по типам автомобилей
        var vehicleTypes = await _context.Vehicles
            .GroupBy(v => v.VehicleType)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Type, x => x.Count);

        // Активность пользователей (топ-5 по количеству поездок)
        var activeUsers = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                TripsCount = _context.Bookings.Count(b => b.UserId == u.Id),
                TotalSpent = _context.Bookings.Where(b => b.UserId == u.Id).Sum(b => (double?)b.TotalCost) ?? 0
            })
            .OrderByDescending(x => x.TripsCount)
            .Take(5)
            .Select(u => new
            {
                id = u.Id,
                first_name = u.FirstName,
                last_name = u.LastName,
                email = u.Email,
                bookings_count = u.TripsCount,
                total_spent = u.TotalSpent
            })
            .ToListAsync();

        // Инциденты
        var totalIncidents = await _context.Incidents.CountAsync();
        var reportedIncidents = await _context.Incidents.CountAsync(i => i.Status == "reported");
        var inProgressIncidents = await _context.Incidents.CountAsync(i => i.Status == "in_progress");
        var resolvedIncidents = await _context.Incidents.CountAsync(i => i.Status == "resolved");

        return Ok(new
        {
            overview = new
            {
                total_users = totalUsers,
                total_vehicles = totalVehicles,
                total_bookings = totalBookings,
                total_revenue = Math.Round(totalRevenue, 2),
                monthly_revenue = Math.Round(monthlyRevenue, 2)
            },
            vehicles = new
            {
                available = availableVehicles,
                in_use = inUseVehicles,
                maintenance = maintenanceVehicles,
                by_type = vehicleTypes
            },
            bookings = new
            {
                active = activeBookings,
                completed = completedBookings,
                pending = pendingBookings
            },
            incidents = new
            {
                total = totalIncidents,
                reported = reportedIncidents,
                in_progress = inProgressIncidents,
                resolved = resolvedIncidents
            },
            popular_vehicles = popularVehicles,
            active_users = activeUsers
        });
    }

    // GET: api/admin/stats/revenue
    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueStats()
    {
        // Выручка за последние 30 дней (по дням)
        var last30Days = DateTime.Now.AddDays(-30);

        var dailyRevenue = await _context.Bookings
            .Where(b => b.Status == "completed" && b.EndTime >= last30Days)
            .GroupBy(b => b.EndTime!.Value.Date)
            .Select(g => new
            {
                date = g.Key.ToString("yyyy-MM-dd"),
                revenue = g.Sum(b => b.TotalCost)
            })
            .OrderBy(x => x.date)
            .ToListAsync();

        // Выручка по тарифам
        var revenueByTariff = await _context.Bookings
            .Where(b => b.Status == "completed")
            .GroupBy(b => b.Tariff!.Name)
            .Select(g => new
            {
                tariff = g.Key,
                revenue = g.Sum(b => b.TotalCost),
                bookings = g.Count()
            })
            .ToListAsync();

        return Ok(new
        {
            daily_revenue_last_30_days = dailyRevenue,
            revenue_by_tariff = revenueByTariff
        });
    }
}

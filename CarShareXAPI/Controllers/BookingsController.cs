using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/bookings")]
[ApiController]
public class BookingsController : ControllerBase
{
    private readonly CarShareContext _context;

    public BookingsController(CarShareContext context)
    {
        _context = context;
    }

    // POST: api/bookings
    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto bookingData, [FromQuery(Name = "user_id")] int userId)
    {
        // Проверка автомобиля
        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.Id == bookingData.VehicleId);

        if (vehicle == null)
        {
            return NotFound(new { detail = "Автомобиль не найден" });
        }

        if (vehicle.Status != "available")
        {
            return BadRequest(new { detail = "Автомобиль недоступен" });
        }

        // Получение тарифа
        var tariff = await _context.Tariffs
            .FirstOrDefaultAsync(t => t.Id == bookingData.TariffId);

        if (tariff == null)
        {
            return NotFound(new { detail = "Тариф не найден" });
        }

        // Расчет количества дней
        var daysCount = (bookingData.EndDate - bookingData.StartDate).Days;

        if (daysCount <= 0)
        {
            return BadRequest(new { detail = "Дата окончания должна быть позже даты начала" });
        }

        // Расчет стоимости (за день = 24 часа по почасовому тарифу)
        double pricePerDay;
        double totalCost;

        if (tariff.PricePerHour.HasValue)
        {
            // Цена за день = цена за час * 24 часа
            pricePerDay = tariff.PricePerHour.Value * 24;
            totalCost = pricePerDay * daysCount;
        }
        else if (tariff.PricePerMinute.HasValue)
        {
            // Цена за день = цена за минуту * 1440 минут (24 часа)
            pricePerDay = tariff.PricePerMinute.Value * 1440;
            totalCost = pricePerDay * daysCount;
        }
        else
        {
            return BadRequest(new { detail = "У тарифа не указана цена" });
        }

        // Округляем до 2 знаков после запятой
        totalCost = Math.Round(totalCost, 2);

        // Проверка баланса пользователя
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        if (user.Balance < totalCost)
        {
            return BadRequest(new { detail = $"Недостаточно средств. Требуется: {totalCost:F2} ₽, доступно: {user.Balance:F2} ₽" });
        }

        // Списание с баланса
        user.Balance -= totalCost;

        // Конвертируем даты в datetime (начало дня для start_date, конец дня для end_date)
        var startDateTime = bookingData.StartDate.Date;
        var endDateTime = bookingData.EndDate.Date.AddDays(1).AddSeconds(-1);

        // Создание бронирования
        var newBooking = new Booking
        {
            UserId = userId,
            VehicleId = bookingData.VehicleId,
            TariffId = bookingData.TariffId,
            StartTime = startDateTime,
            EndTime = endDateTime,
            DurationHours = null,  // Не используем для посуточной аренды
            TotalCost = totalCost,
            Status = "active"
        };

        // Обновление статуса автомобиля
        vehicle.Status = "in_use";

        _context.Bookings.Add(newBooking);
        await _context.SaveChangesAsync();

        // Создание транзакции
        var transaction = new Transaction
        {
            UserId = userId,
            BookingId = newBooking.Id,
            TransactionType = "payment",
            Amount = totalCost,
            Description = $"Оплата бронирования автомобиля {vehicle.Brand} {vehicle.Model} на {daysCount} дн.",
            Status = "completed"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        // Загружаем связанные данные
        await _context.Entry(newBooking).Reference(b => b.User).LoadAsync();
        await _context.Entry(newBooking).Reference(b => b.Vehicle).LoadAsync();
        await _context.Entry(newBooking).Reference(b => b.Tariff).LoadAsync();

        return Ok(newBooking);
    }

    // GET: api/bookings/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserBookings(int userId)
    {
        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Vehicle)
            .Include(b => b.Tariff)
            .Where(b => b.UserId == userId)
            .ToListAsync();

        return Ok(bookings);
    }

    // PATCH: api/bookings/{bookingId}/complete
    [HttpPatch("{bookingId}/complete")]
    public async Task<IActionResult> CompleteBooking(int bookingId, [FromBody] BookingCompleteDto completeData)
    {
        var booking = await _context.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
        {
            return NotFound(new { detail = "Бронирование не найдено" });
        }

        if (booking.Status != "active")
        {
            return BadRequest(new { detail = "Бронирование уже завершено" });
        }

        // Обновление бронирования
        booking.EndTime = completeData.EndTime;
        booking.TotalCost = completeData.TotalCost;
        booking.Status = "completed";

        // Освобождение автомобиля
        if (booking.Vehicle != null)
        {
            booking.Vehicle.Status = "available";
        }

        // Списание с баланса
        if (booking.User != null)
        {
            booking.User.Balance -= completeData.TotalCost;
        }

        // Создание транзакции
        var transaction = new Transaction
        {
            UserId = booking.UserId,
            BookingId = booking.Id,
            TransactionType = "payment",
            Amount = completeData.TotalCost,
            Status = "completed"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(booking);
    }

    // POST: api/bookings/calculate-cost
    [HttpPost("calculate-cost")]
    public async Task<IActionResult> CalculateBookingCost([FromBody] CostCalculationRequest request)
    {
        // Получение тарифа
        var tariff = await _context.Tariffs
            .FirstOrDefaultAsync(t => t.Id == request.TariffId);

        if (tariff == null)
        {
            return NotFound(new { detail = "Тариф не найден" });
        }

        // Парсим даты
        DateTime startDate;
        DateTime endDate;

        try
        {
            startDate = DateTime.Parse(request.StartDate).Date;
            endDate = DateTime.Parse(request.EndDate).Date;
        }
        catch
        {
            return BadRequest(new { detail = "Неверный формат даты. Используйте YYYY-MM-DD" });
        }

        // Расчет количества дней
        var daysCount = (endDate - startDate).Days;

        if (daysCount <= 0)
        {
            return BadRequest(new { detail = "Дата окончания должна быть позже даты начала" });
        }

        // Расчет стоимости (за день = 24 часа по почасовому тарифу)
        double pricePerDay;
        double totalCost;

        if (tariff.PricePerHour.HasValue)
        {
            pricePerDay = tariff.PricePerHour.Value * 24;
            totalCost = pricePerDay * daysCount;
        }
        else if (tariff.PricePerMinute.HasValue)
        {
            pricePerDay = tariff.PricePerMinute.Value * 1440;
            totalCost = pricePerDay * daysCount;
        }
        else
        {
            return BadRequest(new { detail = "У тарифа не указана цена" });
        }

        totalCost = Math.Round(totalCost, 2);
        pricePerDay = Math.Round(pricePerDay, 2);

        return Ok(new CostCalculationResponse
        {
            TariffId = tariff.Id,
            TariffName = tariff.Name,
            DaysCount = daysCount,
            TotalCost = totalCost,
            PricePerDay = pricePerDay
        });
    }
}

// DTOs
public class BookingCreateDto
{
    [JsonPropertyName("vehicle_id")]
    public int VehicleId { get; set; }

    [JsonPropertyName("tariff_id")]
    public int TariffId { get; set; }

    [JsonPropertyName("start_date")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("end_date")]
    public DateTime EndDate { get; set; }
}

public class BookingCompleteDto
{
    [JsonPropertyName("end_time")]
    public DateTime EndTime { get; set; }

    [JsonPropertyName("total_cost")]
    public double? TotalCost { get; set; }
}

public class CostCalculationRequest
{
    [JsonPropertyName("tariff_id")]
    public int TariffId { get; set; }

    [JsonPropertyName("start_date")]
    public string StartDate { get; set; } = null!;

    [JsonPropertyName("end_date")]
    public string EndDate { get; set; } = null!;
}

public class CostCalculationResponse
{
    [JsonPropertyName("tariff_id")]
    public int TariffId { get; set; }

    [JsonPropertyName("tariff_name")]
    public string TariffName { get; set; } = null!;

    [JsonPropertyName("days_count")]
    public int DaysCount { get; set; }

    [JsonPropertyName("total_cost")]
    public double? TotalCost { get; set; }

    [JsonPropertyName("price_per_day")]
    public double? PricePerDay { get; set; }
}

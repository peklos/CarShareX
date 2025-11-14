using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/profile")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly CarShareContext _context;

    public ProfileController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/profile/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        return Ok(user);
    }

    // PATCH: api/profile/{userId}
    [HttpPatch("{userId}")]
    public async Task<IActionResult> UpdateProfile(int userId, [FromBody] UserUpdateDto userData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        if (!string.IsNullOrEmpty(userData.FirstName))
            user.FirstName = userData.FirstName;

        if (!string.IsNullOrEmpty(userData.LastName))
            user.LastName = userData.LastName;

        if (!string.IsNullOrEmpty(userData.Phone))
            user.Phone = userData.Phone;

        if (!string.IsNullOrEmpty(userData.DriversLicense))
            user.DriversLicense = userData.DriversLicense;

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // GET: api/profile/{userId}/balance
    [HttpGet("{userId}/balance")]
    public async Task<IActionResult> GetBalance(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        return Ok(new { balance = user.Balance });
    }

    // POST: api/profile/{userId}/top-up
    [HttpPost("{userId}/top-up")]
    public async Task<IActionResult> TopUpBalance(int userId, [FromBody] TopUpBalanceRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        if (request.Amount <= 0)
        {
            return BadRequest(new { detail = "Сумма пополнения должна быть больше 0" });
        }

        // Обновляем баланс
        user.Balance += request.Amount;

        // Создаем транзакцию
        var transaction = new Transaction
        {
            UserId = userId,
            BookingId = null,
            TransactionType = "deposit",
            Amount = request.Amount,
            Description = $"Пополнение баланса на {request.Amount:F2} ₽",
            Status = "completed"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(user);
    }
}

// DTOs
public class UserUpdateDto
{
    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("drivers_license")]
    public string? DriversLicense { get; set; }
}

public class TopUpBalanceRequest
{
    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }
}

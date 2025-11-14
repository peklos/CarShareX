using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/transactions")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly CarShareContext _context;

    public TransactionsController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/transactions/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserTransactions(int userId)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .ToListAsync();

        return Ok(transactions);
    }

    // POST: api/transactions
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromQuery(Name = "user_id")] int userId, [FromBody] TransactionCreateDto transactionData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        if (transactionData.Amount <= 0)
        {
            return BadRequest(new { detail = "Сумма должна быть положительной" });
        }

        // Обновление баланса для депозита
        if (transactionData.TransactionType == "deposit")
        {
            user.Balance += transactionData.Amount ?? 0;
        }

        // Создание транзакции
        var transaction = new Transaction
        {
            UserId = userId,
            TransactionType = transactionData.TransactionType,
            Amount = transactionData.Amount ?? 0,
            Description = transactionData.Description,
            BookingId = transactionData.BookingId,
            Status = "completed"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }

    // POST: api/transactions/deposit
    [HttpPost("deposit")]
    public async Task<IActionResult> DepositBalance(
        [FromQuery(Name = "user_id")] int userId,
        [FromQuery] double amount,
        [FromQuery] string description = "Пополнение баланса")
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        if (amount <= 0)
        {
            return BadRequest(new { detail = "Сумма должна быть положительной" });
        }

        // Пополнение баланса
        user.Balance += amount;

        // Создание транзакции
        var transaction = new Transaction
        {
            UserId = userId,
            TransactionType = "deposit",
            Amount = amount,
            Description = description,
            Status = "completed"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }
}

// DTOs
public class TransactionCreateDto
{
    [JsonPropertyName("transaction_type")]
    public string TransactionType { get; set; } = null!;

    [JsonPropertyName("amount")]
    public double? Amount { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("booking_id")]
    public int? BookingId { get; set; }
}

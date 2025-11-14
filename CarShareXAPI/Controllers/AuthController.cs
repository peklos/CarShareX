using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly CarShareContext _context;

    public AuthController(CarShareContext context)
    {
        _context = context;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserCreateDto userData)
    {
        // Проверка email
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == userData.Email);

        if (existingUser != null)
        {
            return BadRequest(new { detail = "Email уже зарегистрирован" });
        }

        // Проверка телефона
        var existingPhone = await _context.Users
            .FirstOrDefaultAsync(u => u.Phone == userData.Phone);

        if (existingPhone != null)
        {
            return BadRequest(new { detail = "Телефон уже зарегистрирован" });
        }

        // Создание пользователя
        var newUser = new User
        {
            FirstName = userData.FirstName,
            LastName = userData.LastName,
            Email = userData.Email,
            Phone = userData.Phone,
            Password = userData.Password,  // БЕЗ хеширования (учебный проект)
            DriversLicense = userData.DriversLicense,
            Balance = 0.0m
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(newUser);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginData.Email);

        if (user == null || user.Password != loginData.Password)
        {
            return Unauthorized(new { detail = "Неверный email или пароль" });
        }

        return Ok(new
        {
            message = "Вход выполнен успешно",
            user = new
            {
                id = user.Id,
                first_name = user.FirstName,
                last_name = user.LastName,
                email = user.Email,
                phone = user.Phone,
                balance = user.Balance
            }
        });
    }

    // GET: api/auth/me/{userId}
    [HttpGet("me/{userId}")]
    public async Task<IActionResult> GetCurrentUser(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        return Ok(user);
    }
}

// DTOs
public class UserCreateDto
{
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = null!;

    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = null!;

    [JsonPropertyName("email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = null!;

    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;

    [JsonPropertyName("drivers_license")]
    public string DriversLicense { get; set; } = null!;
}

public class UserLoginDto
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;
}

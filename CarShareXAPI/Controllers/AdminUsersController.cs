using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/users")]
[ApiController]
public class AdminUsersController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminUsersController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/users
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // GET: api/admin/users/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        return Ok(user);
    }

    // PATCH: api/admin/users/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUserUpdateDto userData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

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

    // DELETE: api/admin/users/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { detail = "Пользователь не найден" });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Пользователь удален", user_id = id });
    }
}

// DTOs
public class AdminUserUpdateDto
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

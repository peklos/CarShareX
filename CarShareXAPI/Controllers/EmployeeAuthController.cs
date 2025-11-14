using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/auth")]
[ApiController]
public class EmployeeAuthController : ControllerBase
{
    private readonly CarShareContext _context;

    public EmployeeAuthController(CarShareContext context)
    {
        _context = context;
    }

    // POST: api/admin/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> EmployeeLogin([FromBody] EmployeeLoginDto loginData)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == loginData.Email);

        if (employee == null || employee.Password != loginData.Password)
        {
            return Unauthorized(new { detail = "Неверный email или пароль" });
        }

        // Получаем роль
        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == employee.RoleId);

        return Ok(new
        {
            message = "Вход выполнен успешно",
            employee = new
            {
                id = employee.Id,
                first_name = employee.FirstName,
                last_name = employee.LastName,
                email = employee.Email,
                role = role?.Name,
                role_id = employee.RoleId,
                branch_id = employee.BranchId
            }
        });
    }

    // GET: api/admin/auth/me/{employeeId}
    [HttpGet("me/{employeeId}")]
    public async Task<IActionResult> GetCurrentEmployee(int employeeId)
    {
        var employee = await _context.Employees
            .Include(e => e.Role)
            .Include(e => e.Branch)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
        {
            return NotFound(new { detail = "Сотрудник не найден" });
        }

        return Ok(employee);
    }
}

// DTOs
public class EmployeeLoginDto
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;
}

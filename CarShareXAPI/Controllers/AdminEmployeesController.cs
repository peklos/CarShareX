using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/employees")]
[ApiController]
public class AdminEmployeesController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminEmployeesController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/employees
    [HttpGet]
    public async Task<IActionResult> GetAllEmployees([FromQuery(Name = "employee_id")] int employeeId)
    {
        // Проверка прав (только SuperAdmin)
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null || employee.RoleId != 1) // role_id=1 это SuperAdmin
        {
            return StatusCode(403, new { detail = "Доступ запрещен. Требуется роль SuperAdmin" });
        }

        var employees = await _context.Employees
            .Include(e => e.Role)
            .Include(e => e.Branch)
            .ToListAsync();

        return Ok(employees);
    }

    // POST: api/admin/employees
    [HttpPost]
    public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto employeeData, [FromQuery(Name = "admin_id")] int adminId)
    {
        // Проверка прав (только SuperAdmin)
        var admin = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == adminId);

        if (admin == null || admin.RoleId != 1)
        {
            return StatusCode(403, new { detail = "Доступ запрещен. Требуется роль SuperAdmin" });
        }

        // Проверка email
        var existing = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == employeeData.Email);

        if (existing != null)
        {
            return BadRequest(new { detail = "Email уже используется" });
        }

        var newEmployee = new Employee
        {
            FirstName = employeeData.FirstName,
            LastName = employeeData.LastName,
            Email = employeeData.Email,
            Password = employeeData.Password,
            RoleId = employeeData.RoleId,
            BranchId = employeeData.BranchId
        };

        _context.Employees.Add(newEmployee);
        await _context.SaveChangesAsync();

        return Ok(newEmployee);
    }

    // PATCH: api/admin/employees/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto employeeData, [FromQuery(Name = "admin_id")] int adminId)
    {
        // Проверка прав (только SuperAdmin)
        var admin = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == adminId);

        if (admin == null || admin.RoleId != 1)
        {
            return StatusCode(403, new { detail = "Доступ запрещен" });
        }

        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee == null)
        {
            return NotFound(new { detail = "Сотрудник не найден" });
        }

        if (!string.IsNullOrEmpty(employeeData.FirstName))
            employee.FirstName = employeeData.FirstName;

        if (!string.IsNullOrEmpty(employeeData.LastName))
            employee.LastName = employeeData.LastName;

        if (!string.IsNullOrEmpty(employeeData.Email))
            employee.Email = employeeData.Email;

        if (employeeData.RoleId.HasValue)
            employee.RoleId = employeeData.RoleId.Value;

        if (employeeData.BranchId.HasValue)
            employee.BranchId = employeeData.BranchId;

        await _context.SaveChangesAsync();

        return Ok(employee);
    }

    // DELETE: api/admin/employees/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id, [FromQuery(Name = "admin_id")] int adminId)
    {
        // Проверка прав (только SuperAdmin)
        var admin = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == adminId);

        if (admin == null || admin.RoleId != 1)
        {
            return StatusCode(403, new { detail = "Доступ запрещен" });
        }

        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee == null)
        {
            return NotFound(new { detail = "Сотрудник не найден" });
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Сотрудник удален", employee_id = id });
    }
}

// DTOs
public class EmployeeCreateDto
{
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = null!;

    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = null!;

    [JsonPropertyName("email")]
    public string Email { get; set; } = null!;

    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;

    [JsonPropertyName("role_id")]
    public int RoleId { get; set; }

    [JsonPropertyName("branch_id")]
    public int? BranchId { get; set; }
}

public class EmployeeUpdateDto
{
    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("role_id")]
    public int? RoleId { get; set; }

    [JsonPropertyName("branch_id")]
    public int? BranchId { get; set; }
}

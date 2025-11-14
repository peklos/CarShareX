using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;
using CarShareXAPI.Models;
using System.Text.Json.Serialization;

namespace CarShareXAPI.Controllers;

[Route("api/admin/branches")]
[ApiController]
public class AdminBranchesController : ControllerBase
{
    private readonly CarShareContext _context;

    public AdminBranchesController(CarShareContext context)
    {
        _context = context;
    }

    // GET: api/admin/branches
    [HttpGet]
    public async Task<IActionResult> GetAllBranches()
    {
        var branches = await _context.Branches.ToListAsync();
        return Ok(branches);
    }

    // POST: api/admin/branches
    [HttpPost]
    public async Task<IActionResult> CreateBranch([FromBody] BranchCreateDto branchData)
    {
        var newBranch = new Branch
        {
            Name = branchData.Name,
            Address = branchData.Address,
            Phone = branchData.Phone
        };

        _context.Branches.Add(newBranch);
        await _context.SaveChangesAsync();

        return Ok(newBranch);
    }

    // PATCH: api/admin/branches/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateBranch(int id, [FromBody] BranchUpdateDto branchData)
    {
        var branch = await _context.Branches
            .FirstOrDefaultAsync(b => b.Id == id);

        if (branch == null)
        {
            return NotFound(new { detail = "Офис не найден" });
        }

        if (!string.IsNullOrEmpty(branchData.Name))
            branch.Name = branchData.Name;

        if (!string.IsNullOrEmpty(branchData.Address))
            branch.Address = branchData.Address;

        if (!string.IsNullOrEmpty(branchData.Phone))
            branch.Phone = branchData.Phone;

        await _context.SaveChangesAsync();

        return Ok(branch);
    }

    // DELETE: api/admin/branches/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBranch(int id)
    {
        var branch = await _context.Branches
            .FirstOrDefaultAsync(b => b.Id == id);

        if (branch == null)
        {
            return NotFound(new { detail = "Офис не найден" });
        }

        _context.Branches.Remove(branch);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Офис удален", branch_id = id });
    }
}

// DTOs
public class BranchCreateDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("address")]
    public string Address { get; set; } = null!;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = null!;
}

public class BranchUpdateDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("address")]
    public string? Address { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CarShareXAPI.Models;

[Index(nameof(Name))]
public class Role
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}

[Index(nameof(Name))]
public class Branch
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [MaxLength(20)]
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonIgnore]
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}

[Index(nameof(Email))]
[Index(nameof(RoleId))]
[Index(nameof(BranchId))]
public class Employee
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("password")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string Password { get; set; } = string.Empty;

    [ForeignKey("Role")]
    [JsonPropertyName("role_id")]
    public int? RoleId { get; set; }

    [ForeignKey("Branch")]
    [JsonPropertyName("branch_id")]
    public int? BranchId { get; set; }

    [JsonPropertyName("role")]
    public Role? Role { get; set; }

    [JsonPropertyName("branch")]
    public Branch? Branch { get; set; }
}

[Index(nameof(Email))]
[Index(nameof(Phone))]
public class User
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("password")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(20)]
    [JsonPropertyName("drivers_license")]
    public string? DriversLicense { get; set; }

    [JsonPropertyName("balance")]
    public double Balance { get; set; } = 0.0;

    [JsonIgnore]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    [JsonIgnore]
    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

[Index(nameof(Name))]
public class Tariff
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("price_per_minute")]
    public double? PricePerMinute { get; set; }

    [JsonPropertyName("price_per_hour")]
    public double? PricePerHour { get; set; }

    [JsonIgnore]
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}

[Index(nameof(Name))]
public class ParkingZone
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("capacity")]
    public int Capacity { get; set; } = 10;

    [JsonIgnore]
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}

[Index(nameof(LicensePlate))]
[Index(nameof(Brand))]
[Index(nameof(VehicleType))]
[Index(nameof(Status))]
[Index(nameof(Status), nameof(VehicleType), Name = "IX_Vehicle_Status_Type")]
[Index(nameof(Brand), nameof(Model), Name = "IX_Vehicle_Brand_Model")]
public class Vehicle
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    [JsonPropertyName("license_plate")]
    public string LicensePlate { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("brand")]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    [JsonPropertyName("vehicle_type")]
    public string VehicleType { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int? Year { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [MaxLength(500)]
    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }

    [MaxLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "available";

    [ForeignKey("ParkingZone")]
    [JsonPropertyName("parking_zone_id")]
    public int? ParkingZoneId { get; set; }

    [ForeignKey("Tariff")]
    [JsonPropertyName("tariff_id")]
    public int? TariffId { get; set; }

    [JsonPropertyName("parking_zone")]
    public ParkingZone? ParkingZone { get; set; }

    [JsonPropertyName("tariff")]
    public Tariff? Tariff { get; set; }

    [JsonIgnore]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [JsonIgnore]
    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

[Index(nameof(UserId))]
[Index(nameof(VehicleId))]
[Index(nameof(StartTime))]
[Index(nameof(Status))]
[Index(nameof(UserId), nameof(Status), Name = "IX_Booking_User_Status")]
[Index(nameof(VehicleId), nameof(Status), Name = "IX_Booking_Vehicle_Status")]
public class Booking
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [ForeignKey("User")]
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [ForeignKey("Vehicle")]
    [JsonPropertyName("vehicle_id")]
    public int VehicleId { get; set; }

    [ForeignKey("Tariff")]
    [JsonPropertyName("tariff_id")]
    public int? TariffId { get; set; }

    [Required]
    [JsonPropertyName("start_time")]
    public DateTime StartTime { get; set; }

    [JsonPropertyName("end_time")]
    public DateTime? EndTime { get; set; }

    [JsonPropertyName("duration_hours")]
    public double? DurationHours { get; set; }

    [JsonPropertyName("total_cost")]
    public double TotalCost { get; set; } = 0.0;

    [MaxLength(30)]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "pending";

    [JsonPropertyName("user")]
    public User? User { get; set; }

    [JsonPropertyName("vehicle")]
    public Vehicle? Vehicle { get; set; }

    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    [JsonIgnore]
    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

[Index(nameof(UserId))]
[Index(nameof(BookingId))]
[Index(nameof(TransactionType))]
[Index(nameof(Status))]
[Index(nameof(UserId), nameof(TransactionType), Name = "IX_Transaction_User_Type")]
public class Transaction
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [ForeignKey("User")]
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [ForeignKey("Booking")]
    [JsonPropertyName("booking_id")]
    public int? BookingId { get; set; }

    [Required]
    [MaxLength(30)]
    [JsonPropertyName("transaction_type")]
    public string TransactionType { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("amount")]
    public double Amount { get; set; }

    [MaxLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime? CreatedAt { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "completed";

    [JsonPropertyName("user")]
    public User? User { get; set; }

    [JsonPropertyName("booking")]
    public Booking? Booking { get; set; }
}

[Index(nameof(BookingId))]
[Index(nameof(VehicleId))]
[Index(nameof(UserId))]
[Index(nameof(IncidentType))]
[Index(nameof(Status))]
[Index(nameof(Status), nameof(IncidentType), Name = "IX_Incident_Status_Type")]
[Index(nameof(VehicleId), nameof(Status), Name = "IX_Incident_Vehicle_Status")]
public class Incident
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [ForeignKey("Booking")]
    [JsonPropertyName("booking_id")]
    public int? BookingId { get; set; }

    [ForeignKey("Vehicle")]
    [JsonPropertyName("vehicle_id")]
    public int VehicleId { get; set; }

    [ForeignKey("User")]
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    [JsonPropertyName("incident_type")]
    public string IncidentType { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [MaxLength(30)]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "reported";

    [JsonPropertyName("booking")]
    public Booking? Booking { get; set; }

    [JsonPropertyName("vehicle")]
    public Vehicle? Vehicle { get; set; }

    [JsonPropertyName("user")]
    public User? User { get; set; }
}

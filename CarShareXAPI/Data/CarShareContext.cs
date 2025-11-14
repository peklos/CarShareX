using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Models;

namespace CarShareXAPI.Data;

public class CarShareContext : DbContext
{
    public CarShareContext(DbContextOptions<CarShareContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Branch> Branches { get; set; } = null!;
    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Tariff> Tariffs { get; set; } = null!;
    public DbSet<ParkingZone> ParkingZones { get; set; } = null!;
    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<Incident> Incidents { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Конфигурация уникальных индексов
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.Name)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Phone)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.DriversLicense)
            .IsUnique();

        modelBuilder.Entity<Vehicle>()
            .HasIndex(v => v.LicensePlate)
            .IsUnique();

        // Конфигурация каскадного удаления
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Role)
            .WithMany(r => r.Employees)
            .HasForeignKey(e => e.RoleId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Branch)
            .WithMany(b => b.Employees)
            .HasForeignKey(e => e.BranchId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.ParkingZone)
            .WithMany(p => p.Vehicles)
            .HasForeignKey(v => v.ParkingZoneId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Tariff)
            .WithMany(t => t.Vehicles)
            .HasForeignKey(v => v.TariffId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Vehicle)
            .WithMany(v => v.Bookings)
            .HasForeignKey(b => b.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.User)
            .WithMany(u => u.Transactions)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Booking)
            .WithMany(b => b.Transactions)
            .HasForeignKey(t => t.BookingId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Incident>()
            .HasOne(i => i.User)
            .WithMany(u => u.Incidents)
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Incident>()
            .HasOne(i => i.Vehicle)
            .WithMany(v => v.Incidents)
            .HasForeignKey(i => i.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Incident>()
            .HasOne(i => i.Booking)
            .WithMany(b => b.Incidents)
            .HasForeignKey(i => i.BookingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Настройка базы данных SQLite
var dbPath = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
    "CarShareX",
    "carsharex.db"
);

// Создаем папку если её нет
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);

builder.Services.AddDbContext<CarShareContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// CORS для Tauri десктоп приложения
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "tauri://localhost",           // Tauri production
                "http://tauri.localhost",       // Tauri alternative
                "http://localhost:1420",        // Tauri dev (default port)
                "http://localhost:5173",        // Vite dev server
                "http://127.0.0.1:1420",
                "http://127.0.0.1:5173"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() {
        Title = "CarShareX API",
        Version = "1.0.0",
        Description = "API для каршеринг-приложения CarShareX"
    });
});

var app = builder.Build();

// Инициализация БД
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CarShareContext>();
    context.Database.EnsureCreated();
    DatabaseInitializer.Initialize(context);
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CarShareX API v1"));

app.UseCors();

app.MapControllers();

Console.WriteLine("✅ CarShareX Backend API запущен");
Console.WriteLine($"🌐 API URL: http://localhost:5000");
Console.WriteLine($"📊 Swagger: http://localhost:5000/swagger");
Console.WriteLine($"🗄️  База данных: {dbPath}");
Console.WriteLine();
Console.WriteLine("💡 Для работы приложения запустите Tauri frontend отдельно");
Console.WriteLine("   В папке front выполните: npm run tauri:dev или npm run tauri:build");

app.Run("http://0.0.0.0:5000");

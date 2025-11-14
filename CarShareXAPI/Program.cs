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

// CORS для React фронтенда
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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

// Статические файлы (React build)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Fallback для React Router
app.MapFallbackToFile("index.html");

Console.WriteLine("✅ CarShareX API работает");
Console.WriteLine($"📊 Swagger: http://localhost:5000/swagger");
Console.WriteLine($"🗄️  База данных: {dbPath}");

app.Run("http://0.0.0.0:5000");

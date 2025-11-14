using CarShareXAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CarShareXAPI.Data;

public static class DatabaseInitializer
{
    public static void Initialize(CarShareContext context)
    {
        // Проверяем, есть ли уже данные
        if (context.Roles.Any())
        {
            Console.WriteLine("ℹ️  База данных уже заполнена");
            return;
        }

        Console.WriteLine("\n" + new string('=', 50));
        Console.WriteLine("🚀 Инициализация базы данных...");
        Console.WriteLine(new string('=', 50) + "\n");

        // Картинка автомобиля (одна для всех)
        const string carImageUrl = "/car.png";

        // Роли
        var roles = new[]
        {
            new Role { Name = "SuperAdmin" },
            new Role { Name = "Manager" },
            new Role { Name = "Support" },
            new Role { Name = "Mechanic" }
        };

        context.Roles.AddRange(roles);
        context.SaveChanges();
        Console.WriteLine("✅ Роли созданы");

        // Офисы
        var branches = new[]
        {
            new Branch { Name = "Центральный офис", Address = "Москва, ул. Тверская, 10", Phone = "+7 (495) 123-45-67" },
            new Branch { Name = "Офис Арбат", Address = "Москва, ул. Арбат, 25", Phone = "+7 (495) 234-56-78" },
            new Branch { Name = "Офис ВДНХ", Address = "Москва, проспект Мира, 119", Phone = "+7 (495) 345-67-89" }
        };

        context.Branches.AddRange(branches);
        context.SaveChanges();
        Console.WriteLine("✅ Офисы созданы");

        // Сотрудники
        var employees = new[]
        {
            new Employee { FirstName = "Алексей", LastName = "Иванов", Email = "ivanov@carsharex.ru", Password = "admin123", RoleId = 1, BranchId = 1 },
            new Employee { FirstName = "Мария", LastName = "Петрова", Email = "petrova@carsharex.ru", Password = "manager123", RoleId = 2, BranchId = 1 },
            new Employee { FirstName = "Дмитрий", LastName = "Сидоров", Email = "sidorov@carsharex.ru", Password = "support123", RoleId = 3, BranchId = 2 },
            new Employee { FirstName = "Сергей", LastName = "Кузнецов", Email = "kuznetsov@carsharex.ru", Password = "mechanic123", RoleId = 4, BranchId = 3 }
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();
        Console.WriteLine("✅ Сотрудники созданы");

        // Пользователи
        var users = new[]
        {
            new User { FirstName = "Иван", LastName = "Морозов", Email = "morozov@mail.ru", Phone = "+79161234572", Password = "user123", DriversLicense = "77 12 345678", Balance = 10000.0 },
            new User { FirstName = "Елена", LastName = "Васильева", Email = "vasileva@gmail.com", Phone = "+79161234573", Password = "user123", DriversLicense = "77 23 456789", Balance = 10000.0 },
            new User { FirstName = "Михаил", LastName = "Новиков", Email = "novikov@yandex.ru", Phone = "+79161234574", Password = "user123", DriversLicense = "77 34 567890", Balance = 10000.0 },
            new User { FirstName = "Ольга", LastName = "Козлова", Email = "kozlova@mail.ru", Phone = "+79161234575", Password = "user123", DriversLicense = "77 45 678901", Balance = 10000.0 },
            new User { FirstName = "Александр", LastName = "Лебедев", Email = "lebedev@gmail.com", Phone = "+79161234576", Password = "user123", DriversLicense = "77 56 789012", Balance = 10000.0 }
        };

        context.Users.AddRange(users);
        context.SaveChanges();
        Console.WriteLine("✅ Пользователи созданы");

        // Тарифы
        var tariffs = new[]
        {
            new Tariff { Name = "Поминутный", PricePerMinute = 8.0, PricePerHour = null },
            new Tariff { Name = "Почасовой", PricePerMinute = null, PricePerHour = 350.0 },
            new Tariff { Name = "Суточный", PricePerMinute = null, PricePerHour = 100.0 },
            new Tariff { Name = "Премиум", PricePerMinute = 12.0, PricePerHour = 550.0 }
        };

        context.Tariffs.AddRange(tariffs);
        context.SaveChanges();
        Console.WriteLine("✅ Тарифы созданы");

        // Парковочные зоны
        var parkingZones = new[]
        {
            new ParkingZone { Name = "Парковка Центр", Address = "Москва, ул. Тверская, 10", Capacity = 15 },
            new ParkingZone { Name = "Парковка Арбат", Address = "Москва, ул. Арбат, 25", Capacity = 12 },
            new ParkingZone { Name = "Парковка Лубянка", Address = "Москва, Лубянская площадь, 2", Capacity = 10 },
            new ParkingZone { Name = "Парковка Парк Культуры", Address = "Москва, ул. Крымский Вал, 9", Capacity = 20 },
            new ParkingZone { Name = "Парковка ВДНХ", Address = "Москва, проспект Мира, 119", Capacity = 25 }
        };

        context.ParkingZones.AddRange(parkingZones);
        context.SaveChanges();
        Console.WriteLine("✅ Парковки созданы");

        // Автомобили
        var vehicles = new[]
        {
            // Sedans (Эконом)
            new Vehicle { LicensePlate = "А123ВС777", Brand = "Kia", Model = "Rio", VehicleType = "sedan", Year = 2022, Color = "Белый", ImageUrl = carImageUrl, Description = "Комфортный седан для городских поездок", Status = "available", ParkingZoneId = 1, TariffId = 1 },
            new Vehicle { LicensePlate = "В456ЕК199", Brand = "Hyundai", Model = "Solaris", VehicleType = "sedan", Year = 2023, Color = "Серебристый", ImageUrl = carImageUrl, Description = "Надежный седан с экономичным расходом", Status = "available", ParkingZoneId = 1, TariffId = 1 },
            new Vehicle { LicensePlate = "Е012ОР199", Brand = "Volkswagen", Model = "Polo", VehicleType = "sedan", Year = 2021, Color = "Синий", ImageUrl = carImageUrl, Description = "Немецкое качество и комфорт", Status = "available", ParkingZoneId = 3, TariffId = 1 },
            new Vehicle { LicensePlate = "К345СТ777", Brand = "Skoda", Model = "Rapid", VehicleType = "sedan", Year = 2022, Color = "Черный", ImageUrl = carImageUrl, Description = "Просторный седан для дальних поездок", Status = "in_use", ParkingZoneId = 4, TariffId = 1 },
            new Vehicle { LicensePlate = "Р890ЭЮ199", Brand = "Kia", Model = "Rio", VehicleType = "sedan", Year = 2020, Color = "Красный", ImageUrl = carImageUrl, Description = "Экономичный городской автомобиль", Status = "maintenance", ParkingZoneId = null, TariffId = 1 },
            new Vehicle { LicensePlate = "Т111АВ777", Brand = "Renault", Model = "Logan", VehicleType = "sedan", Year = 2022, Color = "Серый", ImageUrl = carImageUrl, Description = "Практичный седан для любых задач", Status = "available", ParkingZoneId = 2, TariffId = 1 },
            new Vehicle { LicensePlate = "У222ВО199", Brand = "Volkswagen", Model = "Jetta", VehicleType = "sedan", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Стильный седан премиум-класса", Status = "available", ParkingZoneId = 4, TariffId = 2 },
            new Vehicle { LicensePlate = "Ф333СМ777", Brand = "Toyota", Model = "Camry", VehicleType = "sedan", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Премиальный седан для деловых поездок", Status = "available", ParkingZoneId = 1, TariffId = 4 },
            new Vehicle { LicensePlate = "Х444НР199", Brand = "Hyundai", Model = "Elantra", VehicleType = "sedan", Year = 2022, Color = "Серебристый", ImageUrl = carImageUrl, Description = "Современный дизайн и технологии", Status = "available", ParkingZoneId = 3, TariffId = 1 },
            new Vehicle { LicensePlate = "Ц555ОТ777", Brand = "Skoda", Model = "Octavia", VehicleType = "sedan", Year = 2023, Color = "Синий", ImageUrl = carImageUrl, Description = "Вместительный и экономичный", Status = "available", ParkingZoneId = 5, TariffId = 2 },

            // SUV (Кроссоверы)
            new Vehicle { LicensePlate = "С789МН777", Brand = "Renault", Model = "Duster", VehicleType = "suv", Year = 2022, Color = "Оранжевый", ImageUrl = carImageUrl, Description = "Надежный внедорожник для любых дорог", Status = "available", ParkingZoneId = 2, TariffId = 2 },
            new Vehicle { LicensePlate = "Ч666ПУ199", Brand = "Nissan", Model = "Qashqai", VehicleType = "suv", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Городской кроссовер с полным приводом", Status = "available", ParkingZoneId = 1, TariffId = 2 },
            new Vehicle { LicensePlate = "Ш777РФ777", Brand = "Hyundai", Model = "Tucson", VehicleType = "suv", Year = 2022, Color = "Белый", ImageUrl = carImageUrl, Description = "Просторный кроссовер для всей семьи", Status = "available", ParkingZoneId = 3, TariffId = 2 },
            new Vehicle { LicensePlate = "Щ888СХ199", Brand = "Kia", Model = "Sportage", VehicleType = "suv", Year = 2023, Color = "Серый", ImageUrl = carImageUrl, Description = "Спортивный кроссовер с мощным двигателем", Status = "available", ParkingZoneId = 4, TariffId = 2 },
            new Vehicle { LicensePlate = "Э999ТЦ777", Brand = "Volkswagen", Model = "Tiguan", VehicleType = "suv", Year = 2023, Color = "Синий", ImageUrl = carImageUrl, Description = "Немецкое качество в формате SUV", Status = "available", ParkingZoneId = 5, TariffId = 4 },
            new Vehicle { LicensePlate = "Ю100УЧ199", Brand = "Toyota", Model = "RAV4", VehicleType = "suv", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Легендарная надежность Toyota", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "Я200ФШ777", Brand = "Mazda", Model = "CX-5", VehicleType = "suv", Year = 2022, Color = "Красный", ImageUrl = carImageUrl, Description = "Стильный японский кроссовер", Status = "available", ParkingZoneId = 1, TariffId = 2 },
            new Vehicle { LicensePlate = "А300ЩЫ199", Brand = "Honda", Model = "CR-V", VehicleType = "suv", Year = 2023, Color = "Серебристый", ImageUrl = carImageUrl, Description = "Практичный семейный кроссовер", Status = "available", ParkingZoneId = 3, TariffId = 2 },

            // Electric (Электромобили)
            new Vehicle { LicensePlate = "М678УФ199", Brand = "Tesla", Model = "Model 3", VehicleType = "electric", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Премиальный электромобиль с автопилотом", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "Н901ХЦ777", Brand = "Nissan", Model = "Leaf", VehicleType = "electric", Year = 2022, Color = "Синий", ImageUrl = carImageUrl, Description = "Доступный электромобиль для города", Status = "available", ParkingZoneId = 5, TariffId = 2 },
            new Vehicle { LicensePlate = "Б400ЭЮ777", Brand = "Tesla", Model = "Model Y", VehicleType = "electric", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Электрический кроссовер премиум", Status = "available", ParkingZoneId = 1, TariffId = 4 },
            new Vehicle { LicensePlate = "В500ЯА199", Brand = "Hyundai", Model = "Ioniq 5", VehicleType = "electric", Year = 2023, Color = "Серый", ImageUrl = carImageUrl, Description = "Инновационный электрокроссовер", Status = "available", ParkingZoneId = 4, TariffId = 4 },
            new Vehicle { LicensePlate = "Г600БВ777", Brand = "Volkswagen", Model = "ID.4", VehicleType = "electric", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Немецкий электромобиль нового поколения", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "Д700ГД199", Brand = "BMW", Model = "i4", VehicleType = "electric", Year = 2023, Color = "Синий", ImageUrl = carImageUrl, Description = "Спортивный электрический седан BMW", Status = "available", ParkingZoneId = 5, TariffId = 4 },
            new Vehicle { LicensePlate = "Е800ЕЖ777", Brand = "Audi", Model = "e-tron", VehicleType = "electric", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Роскошный электрический кроссовер", Status = "available", ParkingZoneId = 3, TariffId = 4 },

            // Hybrid (Гибриды)
            new Vehicle { LicensePlate = "О234ЧШ199", Brand = "Toyota", Model = "Prius", VehicleType = "hybrid", Year = 2022, Color = "Серебристый", ImageUrl = carImageUrl, Description = "Экономичный гибрид для города", Status = "available", ParkingZoneId = 3, TariffId = 2 },
            new Vehicle { LicensePlate = "П567ЩЫ777", Brand = "Lexus", Model = "UX 300h", VehicleType = "hybrid", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Премиальный гибридный кроссовер", Status = "available", ParkingZoneId = 1, TariffId = 4 },
            new Vehicle { LicensePlate = "Ж900ЗИ199", Brand = "Toyota", Model = "Camry Hybrid", VehicleType = "hybrid", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Бизнес-седан с гибридной установкой", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "З101КЛ777", Brand = "Honda", Model = "Accord Hybrid", VehicleType = "hybrid", Year = 2022, Color = "Синий", ImageUrl = carImageUrl, Description = "Надежный гибридный седан", Status = "available", ParkingZoneId = 4, TariffId = 2 },
            new Vehicle { LicensePlate = "И202МН199", Brand = "Lexus", Model = "NX 300h", VehicleType = "hybrid", Year = 2023, Color = "Серый", ImageUrl = carImageUrl, Description = "Роскошный гибридный кроссовер", Status = "available", ParkingZoneId = 5, TariffId = 4 },
            new Vehicle { LicensePlate = "К303ОП777", Brand = "Kia", Model = "Niro Hybrid", VehicleType = "hybrid", Year = 2022, Color = "Зеленый", ImageUrl = carImageUrl, Description = "Компактный и экономичный гибрид", Status = "available", ParkingZoneId = 1, TariffId = 2 },
            new Vehicle { LicensePlate = "Л404РС199", Brand = "Toyota", Model = "RAV4 Hybrid", VehicleType = "hybrid", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Гибридный кроссовер для приключений", Status = "available", ParkingZoneId = 3, TariffId = 4 },

            // Premium (Премиум сегмент)
            new Vehicle { LicensePlate = "М505ТУ777", Brand = "BMW", Model = "3 Series", VehicleType = "sedan", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Спортивный премиум седан", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "Н606ФХ199", Brand = "Mercedes", Model = "C-Class", VehicleType = "sedan", Year = 2023, Color = "Серебристый", ImageUrl = carImageUrl, Description = "Классика немецкого премиума", Status = "available", ParkingZoneId = 4, TariffId = 4 },
            new Vehicle { LicensePlate = "О707ЦЧ777", Brand = "Audi", Model = "A4", VehicleType = "sedan", Year = 2023, Color = "Серый", ImageUrl = carImageUrl, Description = "Технологичный бизнес-седан", Status = "available", ParkingZoneId = 1, TariffId = 4 },
            new Vehicle { LicensePlate = "П808ШЩ199", Brand = "BMW", Model = "X5", VehicleType = "suv", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Флагманский премиум кроссовер", Status = "available", ParkingZoneId = 5, TariffId = 4 },
            new Vehicle { LicensePlate = "Р909ЪЫ777", Brand = "Mercedes", Model = "GLE", VehicleType = "suv", Year = 2023, Color = "Белый", ImageUrl = carImageUrl, Description = "Роскошный кроссовер для дальних поездок", Status = "available", ParkingZoneId = 3, TariffId = 4 },
            new Vehicle { LicensePlate = "С010ЬЭ199", Brand = "Audi", Model = "Q7", VehicleType = "suv", Year = 2023, Color = "Синий", ImageUrl = carImageUrl, Description = "Семиместный премиум внедорожник", Status = "available", ParkingZoneId = 2, TariffId = 4 },
            new Vehicle { LicensePlate = "Т111ЮЯ777", Brand = "Lexus", Model = "ES 250", VehicleType = "sedan", Year = 2023, Color = "Черный", ImageUrl = carImageUrl, Description = "Комфортный премиум седан", Status = "available", ParkingZoneId = 4, TariffId = 4 }
        };

        context.Vehicles.AddRange(vehicles);
        context.SaveChanges();
        Console.WriteLine("✅ Автомобили созданы");

        // Бронирования
        var bookings = new[]
        {
            // Завершенные бронирования
            new Booking { UserId = 1, VehicleId = 1, TariffId = 1, StartTime = new DateTime(2024, 10, 20, 9, 0, 0), EndTime = new DateTime(2024, 10, 20, 10, 30, 0), TotalCost = 720.0, Status = "completed" },
            new Booking { UserId = 2, VehicleId = 2, TariffId = 2, StartTime = new DateTime(2024, 10, 20, 14, 0, 0), EndTime = new DateTime(2024, 10, 20, 17, 0, 0), TotalCost = 1050.0, Status = "completed" },
            new Booking { UserId = 3, VehicleId = 3, TariffId = 2, StartTime = new DateTime(2024, 10, 21, 11, 0, 0), EndTime = new DateTime(2024, 10, 21, 13, 30, 0), TotalCost = 875.0, Status = "completed" },
            new Booking { UserId = 4, VehicleId = 15, TariffId = 4, StartTime = new DateTime(2024, 10, 21, 16, 0, 0), EndTime = new DateTime(2024, 10, 21, 18, 0, 0), TotalCost = 1440.0, Status = "completed" },
            new Booking { UserId = 5, VehicleId = 4, TariffId = 1, StartTime = new DateTime(2024, 10, 22, 19, 0, 0), EndTime = new DateTime(2024, 10, 22, 20, 0, 0), TotalCost = 480.0, Status = "completed" },
            new Booking { UserId = 1, VehicleId = 6, TariffId = 2, StartTime = new DateTime(2024, 10, 23, 8, 30, 0), EndTime = new DateTime(2024, 10, 23, 12, 0, 0), TotalCost = 1225.0, Status = "completed" },
            new Booking { UserId = 2, VehicleId = 7, TariffId = 1, StartTime = new DateTime(2024, 10, 23, 15, 0, 0), EndTime = new DateTime(2024, 10, 23, 16, 30, 0), TotalCost = 720.0, Status = "completed" },
            new Booking { UserId = 3, VehicleId = 8, TariffId = 4, StartTime = new DateTime(2024, 10, 24, 10, 0, 0), EndTime = new DateTime(2024, 10, 24, 14, 0, 0), TotalCost = 2880.0, Status = "completed" },
            new Booking { UserId = 4, VehicleId = 9, TariffId = 2, StartTime = new DateTime(2024, 10, 24, 18, 0, 0), EndTime = new DateTime(2024, 10, 24, 21, 0, 0), TotalCost = 1050.0, Status = "completed" },
            new Booking { UserId = 5, VehicleId = 10, TariffId = 1, StartTime = new DateTime(2024, 10, 25, 7, 0, 0), EndTime = new DateTime(2024, 10, 25, 9, 0, 0), TotalCost = 960.0, Status = "completed" },
            new Booking { UserId = 1, VehicleId = 11, TariffId = 2, StartTime = new DateTime(2024, 10, 25, 12, 0, 0), EndTime = new DateTime(2024, 10, 25, 15, 30, 0), TotalCost = 1225.0, Status = "completed" },
            new Booking { UserId = 2, VehicleId = 12, TariffId = 4, StartTime = new DateTime(2024, 10, 26, 9, 0, 0), EndTime = new DateTime(2024, 10, 26, 11, 0, 0), TotalCost = 1440.0, Status = "completed" },
            new Booking { UserId = 3, VehicleId = 13, TariffId = 1, StartTime = new DateTime(2024, 10, 26, 16, 0, 0), EndTime = new DateTime(2024, 10, 26, 18, 30, 0), TotalCost = 1200.0, Status = "completed" },
            new Booking { UserId = 4, VehicleId = 14, TariffId = 2, StartTime = new DateTime(2024, 10, 27, 8, 0, 0), EndTime = new DateTime(2024, 10, 27, 12, 0, 0), TotalCost = 1400.0, Status = "completed" },
            new Booking { UserId = 5, VehicleId = 16, TariffId = 4, StartTime = new DateTime(2024, 10, 27, 14, 0, 0), EndTime = new DateTime(2024, 10, 27, 17, 0, 0), TotalCost = 2160.0, Status = "completed" },
            new Booking { UserId = 1, VehicleId = 17, TariffId = 1, StartTime = new DateTime(2024, 10, 28, 10, 0, 0), EndTime = new DateTime(2024, 10, 28, 11, 0, 0), TotalCost = 480.0, Status = "completed" },
            new Booking { UserId = 2, VehicleId = 18, TariffId = 2, StartTime = new DateTime(2024, 10, 28, 15, 0, 0), EndTime = new DateTime(2024, 10, 28, 18, 0, 0), TotalCost = 1050.0, Status = "completed" },
            new Booking { UserId = 3, VehicleId = 19, TariffId = 4, StartTime = new DateTime(2024, 10, 29, 9, 0, 0), EndTime = new DateTime(2024, 10, 29, 13, 0, 0), TotalCost = 2880.0, Status = "completed" },
            new Booking { UserId = 4, VehicleId = 20, TariffId = 1, StartTime = new DateTime(2024, 10, 29, 16, 0, 0), EndTime = new DateTime(2024, 10, 29, 17, 30, 0), TotalCost = 720.0, Status = "completed" },
            new Booking { UserId = 5, VehicleId = 21, TariffId = 2, StartTime = new DateTime(2024, 10, 30, 8, 0, 0), EndTime = new DateTime(2024, 10, 30, 11, 0, 0), TotalCost = 1050.0, Status = "completed" },
            new Booking { UserId = 1, VehicleId = 22, TariffId = 4, StartTime = new DateTime(2024, 10, 30, 13, 0, 0), EndTime = new DateTime(2024, 10, 30, 16, 0, 0), TotalCost = 2160.0, Status = "completed" },
            new Booking { UserId = 2, VehicleId = 23, TariffId = 1, StartTime = new DateTime(2024, 10, 31, 10, 0, 0), EndTime = new DateTime(2024, 10, 31, 12, 0, 0), TotalCost = 960.0, Status = "completed" },
            new Booking { UserId = 3, VehicleId = 24, TariffId = 2, StartTime = new DateTime(2024, 10, 31, 14, 0, 0), EndTime = new DateTime(2024, 10, 31, 17, 30, 0), TotalCost = 1225.0, Status = "completed" },
            new Booking { UserId = 4, VehicleId = 25, TariffId = 4, StartTime = new DateTime(2024, 11, 1, 9, 0, 0), EndTime = new DateTime(2024, 11, 1, 12, 0, 0), TotalCost = 2160.0, Status = "completed" },
            new Booking { UserId = 5, VehicleId = 26, TariffId = 1, StartTime = new DateTime(2024, 11, 1, 15, 0, 0), EndTime = new DateTime(2024, 11, 1, 16, 30, 0), TotalCost = 720.0, Status = "completed" },

            // Активные бронирования
            new Booking { UserId = 1, VehicleId = 5, TariffId = 1, StartTime = new DateTime(2024, 11, 2, 8, 0, 0), EndTime = null, TotalCost = 0.0, Status = "active" },
            new Booking { UserId = 3, VehicleId = 27, TariffId = 2, StartTime = new DateTime(2024, 11, 2, 10, 0, 0), EndTime = null, TotalCost = 0.0, Status = "active" },

            // Ожидающие бронирования
            new Booking { UserId = 2, VehicleId = 28, TariffId = 4, StartTime = new DateTime(2024, 11, 3, 9, 0, 0), EndTime = null, TotalCost = 0.0, Status = "pending" },
            new Booking { UserId = 4, VehicleId = 29, TariffId = 1, StartTime = new DateTime(2024, 11, 3, 14, 0, 0), EndTime = null, TotalCost = 0.0, Status = "pending" },
            new Booking { UserId = 5, VehicleId = 30, TariffId = 2, StartTime = new DateTime(2024, 11, 4, 10, 0, 0), EndTime = null, TotalCost = 0.0, Status = "pending" }
        };

        context.Bookings.AddRange(bookings);
        context.SaveChanges();
        Console.WriteLine("✅ Бронирования созданы");

        // Транзакции
        var transactions = new[]
        {
            new Transaction { UserId = 1, BookingId = 1, TransactionType = "payment", Amount = 720.0, Status = "completed" },
            new Transaction { UserId = 2, BookingId = 2, TransactionType = "payment", Amount = 1050.0, Status = "completed" },
            new Transaction { UserId = 3, BookingId = 3, TransactionType = "payment", Amount = 875.0, Status = "completed" },
            new Transaction { UserId = 4, BookingId = 4, TransactionType = "payment", Amount = 1440.0, Status = "completed" },
            new Transaction { UserId = 5, BookingId = 5, TransactionType = "payment", Amount = 480.0, Status = "completed" },
            new Transaction { UserId = 1, BookingId = null, TransactionType = "deposit", Amount = 1000.0, Status = "completed" },
            new Transaction { UserId = 3, BookingId = 3, TransactionType = "penalty", Amount = 500.0, Status = "completed" }
        };

        context.Transactions.AddRange(transactions);
        context.SaveChanges();
        Console.WriteLine("✅ Транзакции созданы");

        // Инциденты
        var incidents = new[]
        {
            new Incident { BookingId = 3, VehicleId = 3, UserId = 3, IncidentType = "damage", Description = "Царапина на переднем крыле", Status = "in_progress" },
            new Incident { BookingId = null, VehicleId = 10, UserId = 5, IncidentType = "technical_issue", Description = "Автомобиль не заводится", Status = "reported" },
            new Incident { BookingId = 5, VehicleId = 4, UserId = 5, IncidentType = "violation", Description = "Штраф за неправильную парковку", Status = "resolved" }
        };

        context.Incidents.AddRange(incidents);
        context.SaveChanges();
        Console.WriteLine("✅ Инциденты созданы");

        Console.WriteLine("\n" + new string('=', 50));
        Console.WriteLine("✅ Инициализация завершена!");
        Console.WriteLine(new string('=', 50) + "\n");
    }
}

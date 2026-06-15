using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Gateway.Data;

var builder = WebApplication.CreateBuilder(args);

// Register DB context for Centralized Identity Database (PostgreSQL)
    var connectionString = builder.Configuration.GetConnectionString("IdentityConnection") ?? "Host=localhost;Port=5432;Database=medicare_identity_db;Username=postgres;Password=Medicare@2024";
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add MVC Controllers support for Central Auth Controllers
builder.Services.AddControllers();

// JWT Authentication (xác thực trước khi forward request)
var jwtSecret = builder.Configuration["JWT_SECRET"] ?? "CaiNayLaBiMatQuocGiaSieuCapVipPro123!";
var jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? "ClinicAuthService";
var jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? "ClinicUsers";

var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true
    };
});

builder.Services.AddAuthorization();

// Ocelot
var env = builder.Environment.EnvironmentName;
builder.Configuration.AddJsonFile("ocelot.json", false, true);
builder.Configuration.AddJsonFile($"ocelot.{env}.json", true, true);
builder.Services.AddOcelot(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure Central Identity Database is automatically created and seeded at startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
        db.Database.EnsureCreated();
        Console.WriteLine("[Gateway-Auth] Centralized Identity Database ensured & seeded successfully!");

        // Dynamically add CreatedAt column to Users/users table if it doesn't exist
        try
        {
            await db.Database.ExecuteSqlRawAsync(@"
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Users') THEN
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Users' AND column_name = 'CreatedAt') THEN
                            ALTER TABLE ""Users"" ADD COLUMN ""CreatedAt"" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
                        END IF;
                    END IF;

                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'CreatedAt') THEN
                            ALTER TABLE ""users"" ADD COLUMN ""CreatedAt"" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
                        END IF;
                    END IF;
                END $$;
            ");
            Console.WriteLine("[Gateway-Auth] Checked/Added CreatedAt column to Users/users table successfully!");
        }
        catch (Exception colEx)
        {
            Console.WriteLine($"[Gateway-Auth] Warning verifying/adding CreatedAt column: {colEx}");
        }

        // Schema Inspection helper to diagnose issues
        try
        {
            var conn = db.Database.GetDbConnection();
            if (conn.State != System.Data.ConnectionState.Open)
                await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name IN ('Users', 'users')
                ORDER BY table_name, column_name;";
            
            using var reader = await cmd.ExecuteReaderAsync();
            Console.WriteLine("[Gateway-Auth] Database Schema Info (Users/users columns):");
            while (await reader.ReadAsync())
            {
                Console.WriteLine($" - Table: {reader.GetString(0)}, Column: {reader.GetString(1)}, Type: {reader.GetString(2)}");
            }
        }
        catch (Exception schemaEx)
        {
            Console.WriteLine($"[Gateway-Auth] Warning running schema inspection: {schemaEx.Message}");
        }

        // Ensure all default users exist (seed data only works on fresh DB)
        await EnsureDefaultUsers(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Gateway-Auth] Error ensuring Central Identity DB: {ex.Message}");
    }
}

static async Task EnsureDefaultUsers(IdentityDbContext db)
{
    var defaultUsers = new[]
    {
        new { Username = "admin",        Password = "admin",        FullName = "Hệ thống Admin",      Email = "admin@medicare.vn",        Role = "Admin" },
        new { Username = "receptionist", Password = "receptionist", FullName = "Lễ tân Medicare",      Email = "receptionist@medicare.vn", Role = "Receptionist" },
        new { Username = "doctor",       Password = "doctor",       FullName = "Bác sĩ Nguyễn Văn A", Email = "doctora@medicare.vn",      Role = "Doctor" },
        new { Username = "pharmacist",   Password = "pharmacist",   FullName = "Dược sĩ Trần Thị B",  Email = "pharmacist@medicare.vn",   Role = "Pharmacist" },
        new { Username = "patient",      Password = "patient",      FullName = "Bệnh nhân Trần Văn B",Email = "patient@medicare.vn",      Role = "Patient" },
    };

    foreach (var u in defaultUsers)
    {
        if (!db.Users.Any(x => x.Username == u.Username))
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(u.Password));
            var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();

            db.Users.Add(new Gateway.Models.User
            {
                Username = u.Username,
                PasswordHash = hash,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role
            });
            Console.WriteLine($"[Gateway-Auth] Created default user: {u.Username} ({u.Role})");
        }
    }
    await db.SaveChangesAsync();

    // Print all users in DB
    Console.WriteLine("[Gateway-Auth] Existing Users in DB:");
    foreach (var user in db.Users.ToList())
    {
        Console.WriteLine($" - ID: {user.Id}, Username: {user.Username}, Role: {user.Role}");
    }
}

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

#pragma warning disable ASP0014
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
#pragma warning restore ASP0014

await app.UseOcelot();

app.Run();

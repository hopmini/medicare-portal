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

// Ensure Central Identity Database is automatically created and seeded at startup with a robust retry loop
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    int maxRetries = 15;
    int delaySeconds = 3;
    bool success = false;

    for (int i = 1; i <= maxRetries; i++)
    {
        try
        {
            db.Database.EnsureCreated();
            Console.WriteLine("[Gateway-Auth] Centralized Identity Database ensured & seeded successfully!");
            success = true;
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Gateway-Auth Retry {i}/{maxRetries}] Failed to connect to DB: {ex.Message}. Retrying in {delaySeconds}s...");
            System.Threading.Thread.Sleep(delaySeconds * 1000);
        }
    }

    if (!success)
    {
        Console.WriteLine("[Gateway-Auth FATAL] Could not connect to Central Identity DB after all retries.");
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

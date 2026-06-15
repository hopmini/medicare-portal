using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gateway.Data;
using Gateway.Models;
using Microsoft.AspNetCore.Authorization;

namespace Gateway.Controllers
{
    [Route("api/appointment/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IdentityDbContext _context;

        public UsersController(IdentityDbContext context)
        {
            _context = context;
        }

        private async Task EnsureCreatedAtColumnExists()
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(@"
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
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Gateway-Auth Self-Heal] Failed to dynamically inject CreatedAt column: {ex.Message}");
            }
        }

        [HttpGet("patients")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> GetPatients()
        {
            await EnsureCreatedAtColumnExists();
            
            var patients = await _context.Users
                .Where(u => u.Role == "Patient")
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(patients);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            await EnsureCreatedAtColumnExists();

            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("doctors")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Users
                .Where(u => u.Role == "Doctor")
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Không xác định được danh tính người dùng!" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại!" });
            }

            user.FullName = model.FullName;
            user.Email = model.Email;

            await _context.SaveChangesAsync();
            
            return Ok(new { 
                message = "Cập nhật hồ sơ cá nhân thành công!", 
                user = new { 
                    user.Id, 
                    user.Username, 
                    user.FullName, 
                    user.Email, 
                    user.Role 
                } 
            });
        }
    }

    public class UpdateProfileModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

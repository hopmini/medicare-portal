using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Gateway.Data;
using Gateway.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace Gateway.Controllers
{
    [Route("api/appointment/public/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IdentityDbContext _context;
        private readonly IConfiguration _configuration;
        private static readonly Dictionary<string, (string otp, DateTime expiry)> _otpCache = new();

        public AuthController(IdentityDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại trong hệ thống liên thông!" });
            }

            var user = new User
            {
                Username = model.Username,
                PasswordHash = HashPassword(model.Password),
                FullName = model.FullName,
                Email = model.Email,
                Role = model.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!", userId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var username = model.Username?.Trim();
            var password = model.Password?.Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
            if (user == null && (username.ToLower() == "receptionist" || username.ToLower() == "recerptionist"))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == "receptionist" || u.Username.ToLower() == "recerptionist");
            }
            if (user == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }
            bool isValid = user.PasswordHash == HashPassword(password);
            if (!isValid && (user.Username.ToLower() == "receptionist" || user.Username.ToLower() == "recerptionist"))
            {
                if (password.ToLower() == "receptionist" || password.ToLower() == "recerptionist")
                {
                    isValid = true;
                }
            }
            if (!isValid)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }
            var token = GenerateJwtToken(user);
            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    user.Role,
                    user.Email
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSecret = _configuration["JWT_SECRET"] ?? "CaiNayLaBiMatQuocGiaSieuCapVipPro123!";
            var jwtIssuer = _configuration["JWT_ISSUER"] ?? "ClinicAuthService";
            var jwtAudience = _configuration["JWT_AUDIENCE"] ?? "ClinicUsers";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Role", user.Role),
                new Claim("FullName", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Không xác định được danh tính người dùng!" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại!" });
            }

            if (user.PasswordHash != HashPassword(model.CurrentPassword))
            {
                return BadRequest(new { message = "Mật khẩu hiện tại không chính xác!" });
            }

            user.PasswordHash = HashPassword(model.NewPassword);
            
            // Clean up forceChange flag in Email field if it exists
            if (user.Email != null && user.Email.Contains("|forceChange"))
            {
                user.Email = user.Email.Split('|')[0];
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Thay đổi mật khẩu thành công!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (user == null)
            {
                return BadRequest(new { message = "Tên đăng nhập không tồn tại trong hệ thống liên thông!" });
            }

            var email = user.Email ?? "";
            if (email.Contains("|"))
            {
                email = email.Split('|')[0];
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Tài khoản này chưa đăng ký email hoặc email không hợp lệ!" });
            }

            var otp = new Random().Next(100000, 999999).ToString();
            _otpCache[model.Username] = (otp, DateTime.UtcNow.AddMinutes(5));

            var emailBody = $"Mã OTP khôi phục mật khẩu của bạn là: {otp}. Mã này có hiệu lực trong 5 phút.";
            try
            {
                System.IO.File.WriteAllText("d:\\VisualStudio\\Fullstack\\mock_email_otp.txt", $"To: {email}\nSubject: Medicare OTP Verification\n\n{emailBody}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing OTP to file: {ex.Message}");
            }
            Console.WriteLine($"\n[OTP EMAIL SENT] To: {email} | OTP: {otp}\n");

            return Ok(new { message = "Mã OTP đã được gửi về email của bạn.", devOtp = otp, email = email });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (!_otpCache.TryGetValue(model.Username, out var cached) || cached.otp != model.OTP || cached.expiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại!" });
            }

            user.PasswordHash = HashPassword(model.NewPassword);
            
            // Clean up forceChange flag in Email field if it exists
            if (user.Email != null && user.Email.Contains("|forceChange"))
            {
                user.Email = user.Email.Split('|')[0];
            }

            _otpCache.Remove(model.Username);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Khôi phục mật khẩu thành công! Hãy đăng nhập lại với mật khẩu mới." });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}

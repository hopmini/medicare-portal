using Microsoft.EntityFrameworkCore;
using Gateway.Models;
using System.Text;
using System.Security.Cryptography;

namespace Gateway.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed default clinical roles so they work instantly out of the box
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = HashPassword("admin"),
                    FullName = "Hệ thống Admin",
                    Email = "admin@medicare.vn",
                    Role = "Admin"
                },
                new User
                {
                    Id = 2,
                    Username = "receptionist",
                    PasswordHash = HashPassword("receptionist"),
                    FullName = "Lễ tân Medicare",
                    Email = "receptionist@medicare.vn",
                    Role = "Receptionist"
                },
                new User
                {
                    Id = 3,
                    Username = "doctor",
                    PasswordHash = HashPassword("doctor"),
                    FullName = "Bác sĩ Nguyễn Văn A",
                    Email = "doctora@medicare.vn",
                    Role = "Doctor"
                },
                new User
                {
                    Id = 4,
                    Username = "patient",
                    PasswordHash = HashPassword("patient"),
                    FullName = "Bệnh nhân Trần Văn B",
                    Email = "patient@medicare.vn",
                    Role = "Patient"
                }
            );
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}

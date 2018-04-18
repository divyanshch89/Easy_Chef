using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Easy_Chef.Models.DB
{
    public partial class DB_A383F2_easychefContext : DbContext
    {
        public virtual DbSet<Cuisine> Cuisine { get; set; }
        public virtual DbSet<Payment> Payment { get; set; }
        public virtual DbSet<Recipe> Recipe { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<User> User { get; set; }

        public DB_A383F2_easychefContext(DbContextOptions<DB_A383F2_easychefContext> options) : base(options)
        {

        }
        //        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //        {
        //            if (!optionsBuilder.IsConfigured)
        //            {
        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
        //                optionsBuilder.UseSqlServer(@"Server=tcp:sql7004.site4now.net,1433;Database=DB_A383F2_easychef;User Id=DB_A383F2_easychef_admin;Password=@Qazwsx123@;");
        //            }
        //        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cuisine>(entity =>
            {
                entity.Property(e => e.CuisineId).HasColumnName("Cuisine_Id");

                entity.Property(e => e.CuisineName)
                    .IsRequired()
                    .HasColumnName("Cuisine_Name")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(e => e.PaymentId).HasColumnName("Payment_Id");

                entity.Property(e => e.CardNumber)
                    .HasColumnName("Card_Number")
                    .HasMaxLength(50);

                entity.Property(e => e.ExpirationDate)
                    .HasColumnName("Expiration_Date")
                    .HasMaxLength(20);

                entity.Property(e => e.Type).HasMaxLength(50);
            });

            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.Property(e => e.RecipeId).HasColumnName("Recipe_Id");

                entity.Property(e => e.BoxContent)
                    .IsRequired()
                    .HasColumnName("Box_Content")
                    .HasMaxLength(300);

                entity.Property(e => e.ChefName)
                    .HasColumnName("Chef_Name")
                    .HasMaxLength(100);

                entity.Property(e => e.CookLimit)
                    .IsRequired()
                    .HasColumnName("Cook_Limit")
                    .HasMaxLength(30);

                entity.Property(e => e.CuisineId).HasColumnName("Cuisine_Id");

                entity.Property(e => e.DifficultyLevel)
                    .IsRequired()
                    .HasColumnName("Difficulty_Level")
                    .HasMaxLength(30);

                entity.Property(e => e.Image1)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Image2)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Image3).HasMaxLength(200);

                entity.Property(e => e.IsVeg)
                    .IsRequired()
                    .HasMaxLength(5);

                entity.Property(e => e.LongDescription)
                    .IsRequired()
                    .HasColumnName("Long_Description")
                    .HasMaxLength(800);

                entity.Property(e => e.NutritionValue)
                    .IsRequired()
                    .HasColumnName("Nutrition_Value")
                    .HasMaxLength(300);

                entity.Property(e => e.PrepTime)
                    .IsRequired()
                    .HasColumnName("Prep_Time")
                    .HasMaxLength(30);

                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasMaxLength(5);

                entity.Property(e => e.RecipeName)
                    .IsRequired()
                    .HasColumnName("Recipe_Name")
                    .HasMaxLength(100);

                entity.Property(e => e.ShortDescription)
                    .IsRequired()
                    .HasColumnName("Short_Description")
                    .HasMaxLength(500);

                entity.Property(e => e.SpiceLevel)
                    .IsRequired()
                    .HasColumnName("Spice_Level")
                    .HasMaxLength(30);

                entity.HasOne(d => d.Cuisine)
                    .WithMany(p => p.Recipe)
                    .HasForeignKey(d => d.CuisineId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Recipe_Cuisine");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasColumnName("Role_Name")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.PaymentId).HasColumnName("Payment_Id");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.UserAddress)
                    .HasColumnName("User_Address")
                    .HasMaxLength(200);

                entity.Property(e => e.UserEmail)
                    .HasColumnName("User_Email")
                    .HasMaxLength(100);

                entity.Property(e => e.UserFbId)
                    .HasColumnName("User_FB_Id")
                    .HasMaxLength(30);

                entity.Property(e => e.UserPhone)
                    .HasColumnName("User_Phone")
                    .HasMaxLength(20);


                entity.Property(e => e.UserFname)
                    .HasColumnName("User_FName")
                    .HasMaxLength(100);

                entity.Property(e => e.UserLname)
                    .HasColumnName("User_LName")
                    .HasMaxLength(100);

                entity.HasOne(d => d.Payment)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.PaymentId)
                    .HasConstraintName("FK_User_Payment");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Role");
            });
        }
    }
}

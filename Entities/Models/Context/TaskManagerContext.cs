using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;

namespace TaskManager.Entities.Models.Context;

public class TaskManagerContext : DbContext
{
    public TaskManagerContext(DbContextOptions<TaskManagerContext> contextOptions) : base(contextOptions)
    {
    }
    
    public DbSet<GroupModel> GroupModel { get; set; }
    public DbSet<TagModel> TagModel { get; set; }
    public DbSet<TaskModel> TaskModel { get; set; }
    public DbSet<UserModel> UserModel { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskModel>()
            .HasMany(t => t.Assignees)
            .WithMany();

        modelBuilder.Entity<TaskModel>()
            .HasMany(t => t.Tags)
            .WithMany();

        modelBuilder.Entity<GroupModel>()
            .HasMany(g => g.Members)
            .WithOne()
            .IsRequired();
        
        modelBuilder.Entity<GroupModel>()
            .HasMany(g => g.Tags)
            .WithOne()
            .IsRequired();
        
        modelBuilder.Entity<GroupModel>()
            .HasMany(g => g.Tasks)
            .WithOne()
            .IsRequired();
    }
    
    //Enabling split queries globally to work around performance issues
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlite("Data Source=task-manager-database.db",
                o => o.UseQuerySplittingBehavior((QuerySplittingBehavior.SplitQuery)));
    }


 
}
using Microsoft.EntityFrameworkCore;

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
    }
}
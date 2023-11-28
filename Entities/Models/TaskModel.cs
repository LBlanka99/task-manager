using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Entities.Models;

public class TaskModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public DateOnly Deadline { get; set; }
    public List<UserModel> Assignees { get; set; } = new List<UserModel>();
    [Range(1, 100)]
    public int Points { get; set; }
    public List<TagModel> Tags { get; set; } = new List<TagModel>();
    public string? Description { get; set; }
    [DefaultValue(Enums.TaskStatus.InProgress)]
    public TaskStatus status { get; set; }
    public string? ConfirmingPhoto { get; set; }

}
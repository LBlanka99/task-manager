using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Entities.Models;

public class GroupModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    public List<UserModel> Members { get; set; } = new List<UserModel>();
    public List<TagModel> Tags { get; set; } = new List<TagModel>();
    public List<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Entities.Models;

public class UserModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    [Required]
    [MaxLength(30)]
    public string UserName { get; set; }
    public string? Email { get; set; }
    [Required]
    public string Password { get; set; }
    public string? ProfilePicture { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}
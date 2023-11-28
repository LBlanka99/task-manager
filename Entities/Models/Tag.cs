using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Entities.Models;

public class Tag
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    [Required]
    [MaxLength(30)]
    public string Name { get; set; }
    [DefaultValue("#FA8072")]
    public string Color { get; set; }
    public GroupModel Group { get; set; }
}
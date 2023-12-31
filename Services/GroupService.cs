using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Entities.Models.Context;
using TaskManager.Exceptions;
using TaskManager.Services.Base;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class GroupService : TaskManagerService, IGroupService
{
    private readonly IPasswordHasher<UserModel> _hasher;
    private readonly Random _random;
    public GroupService(TaskManagerContext context) : base(context)
    {
        _hasher = new PasswordHasher<UserModel>();
        _random = new Random();
    }

    public async Task<GroupModel?> GetGroupByName(string groupName)
    {
        GroupModel? group = await _context.GroupModel.Include(g => g.Members).FirstOrDefaultAsync(g => g.Name == groupName);
        return group;
    }

    public async Task<GroupModel> CreateNewGroup(NewGroupDTO data)
    {
        if (await GetGroupByName(data.GroupName) != null)
        {
            throw new GroupNameAlreadyInUseException("This group name is already taken! You should pick another.");
        }
        
        string randomColor = $"#{_random.Next(256):X2}{_random.Next(256):X2}{_random.Next(256):X2}";
        
        var user = new UserModel
        {
            UserName = data.UserName,
            Password = data.Password,
            Roles = new List<string> { "admin", "taskCreator" },
            ProfilColor = randomColor
        };
        
        var hashedPassword = _hasher.HashPassword(user, user.Password);
        user.Password = hashedPassword;

        var group = new GroupModel
        {
            Name = data.GroupName,
            Members = new List<UserModel>{user}
        };

        _context.GroupModel.Add(group);
        await _context.SaveChangesAsync();

        return group;
    }

    public async Task<GroupModel> GetGroupByUserId(Guid userId)
    {
        UserModel user = await FindEntityById<UserModel>(userId);
        //How should I let Rider know that the group never can be null here???
        GroupModel group = await _context.GroupModel.Include(g => g.Tags).Include(g => g.Members).FirstOrDefaultAsync(g => g.Members.Contains(user));

        return group!;
    }
    
    public async Task<List<TaskModel>> GetAllTasksInAGroup(Guid groupId)
    {
        GroupModel? group = await _context.GroupModel.Include(g => g.Tasks).ThenInclude(t => t.Assignees)
            .Include(g => g.Tasks).ThenInclude(t => t.Tags).FirstOrDefaultAsync(g => g.Id == groupId);
        if (group is null)
        {
            throw new IdNotFoundException($"The group with the id {groupId} was not found.");
        }
        
        return group.Tasks;
    }

    public async Task<List<TagModel>> GetAllTagsInAGroup(Guid groupId)
    {
        var group = await FindEntityById<GroupModel>(groupId, g => g.Tags);

        return group.Tags;
    }
}
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Entities.Models.Context;
using TaskManager.Exceptions;
using TaskManager.Services.Base;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class UserService : TaskManagerService, IUserService
{
    private readonly IGroupService _groupService;
    private readonly IPasswordHasher<UserModel> _hasher;

    public UserService(TaskManagerContext context, IGroupService groupService) : base(context)
    {
        _groupService = groupService;
        _hasher = new PasswordHasher<UserModel>();
    }

    public async Task<UserModel> AddNewUserToGroup(NewUserDTO data)
    {
        GroupModel? group = await _groupService.GetGroupByName(data.GroupName);
        if (group == null)
        {
            throw new GroupNotFoundException($"The group with name {data.GroupName} was not found.");
        }
        
        UserModel? userWithGivenName = group.Members.Find(u => u.UserName == data.UserName);
        if (userWithGivenName != null)
        {
            throw new UserNameAlreadyInUseException("This user name is already taken! You should pick another.");
        }

        var roles = new List<string>();
        if (data.IsTaskCreator)
        {
            roles.Add("taskCreator");
        }

        var user = new UserModel
        {
            UserName = data.UserName,
            Password = data.Password,
            Roles = roles,
            Email = data.Email
        };

        var hashedPassword = _hasher.HashPassword(user, user.Password);
        user.Password = hashedPassword;
        
        group.Members.Add(user);
        _context.Entry(group).State = EntityState.Modified;
        _context.Entry(user).State = EntityState.Added;
        
        await _context.SaveChangesAsync();
        
        //TODO: ha megadtál e-mail címet, küldeni egy welcome e-mailt az új usernek
        
        return user;
    }
}
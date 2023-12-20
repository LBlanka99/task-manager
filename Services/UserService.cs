using System.Drawing;
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
    private readonly Random _random;

    public UserService(TaskManagerContext context, IGroupService groupService) : base(context)
    {
        _groupService = groupService;
        _hasher = new PasswordHasher<UserModel>();
        _random = new Random();
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
        
        string randomColor = $"#{_random.Next(256):X2}{_random.Next(256):X2}{_random.Next(256):X2}";

        var user = new UserModel
        {
            UserName = data.UserName,
            Password = data.Password,
            Roles = roles,
            Email = data.Email,
            ProfilColor = randomColor
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

    public async Task<UserModel> LogIn(LogInDTO credentials)
    {
        GroupModel? group = await _groupService.GetGroupByName(credentials.GroupName);
        if (group == null)
        {
            throw new GroupNotFoundException($"The group with name {credentials.GroupName} was not found.");
        }
        
        UserModel? user = group.Members.Find(u => u.UserName == credentials.UserName);
        if (user == null)
        {
            throw new UserNotFoundException(
                $"The user with name {credentials.UserName} was not found in the {credentials.GroupName} group.");
        }

        var result = _hasher.VerifyHashedPassword(user, user.Password, credentials.Password);

        //vajon jó gyakorlat külön exceptiont dobni az incorrect username-re és password-re?
        
        if (result == PasswordVerificationResult.Failed)
        {
            throw new IncorrectPasswordException("The provided password is incorrect!");
        }
        
        //itt vajon külön meg kéne néznem a PasswordVerificationResult.SuccessRehashNeeded esetet is?

        return user;
    }

    public async Task<UserModel> AddPointsToUserById(Guid userId, int pointstoAdd)
    {
        UserModel user = await FindEntityById<UserModel>(userId);
        user.Points += pointstoAdd;
        
        await _context.SaveChangesAsync();

        return user;
    }
}
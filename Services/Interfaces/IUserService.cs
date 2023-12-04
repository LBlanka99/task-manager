using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface IUserService
{
    Task<UserModel> AddNewUserToGroup(NewUserDTO data);
    Task<UserModel> LogIn(LogInDTO credentials);
}
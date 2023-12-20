using System.Linq.Expressions;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface IUserService
{
    Task<UserModel> AddNewUserToGroup(NewUserDTO data);
    Task<UserModel> LogIn(LogInDTO credentials);
    Task<T> FindEntityById<T>(Guid id, params Expression<Func<T, object>>[] includes) where T : class;
    Task<UserModel> AddPointsToUserById(Guid userId, int pointstoAdd);
}
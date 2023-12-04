using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers;

[ApiController]
[Route("/api/v1/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<UserModel> PostNewUserToGroup([FromBody] NewUserDTO user)
    {
        if (string.IsNullOrWhiteSpace(user.UserName) || string.IsNullOrWhiteSpace(user.GroupName) || string.IsNullOrWhiteSpace(user.Password))
        {
            throw new ArgumentException("User name, group name and password are required fields!");
        }
        return await _userService.AddNewUserToGroup(user);
    }
}
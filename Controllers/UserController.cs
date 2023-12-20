using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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
        Console.WriteLine("hahó");
        if (string.IsNullOrWhiteSpace(user.UserName) || string.IsNullOrWhiteSpace(user.GroupName) || string.IsNullOrWhiteSpace(user.Password))
        {
            throw new ArgumentException("User name, group name and password are required fields!");
        }
        return await _userService.AddNewUserToGroup(user);
    }

    [AllowAnonymous]
    [HttpPost("log-in")]
    public async Task LogInUser([FromBody] LogInDTO credentials)
    {
        var user = await _userService.LogIn(credentials);

        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        CookieOptions cookieOptions = new CookieOptions();
        cookieOptions.Secure = true;
        cookieOptions.Expires = new DateTimeOffset(2038, 1, 1, 0, 0, 0, TimeSpan.FromHours(0));
        Response.Cookies.Append("id", user.Id.ToString(), cookieOptions);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }

    [HttpGet("log-out")]
    public async Task LogOutUser()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        Response.Cookies.Delete("id");
    }

    [HttpGet("{userId}")]
    public async Task<UserModel> GetUserById(Guid userId)
    {
        return await _userService.FindEntityById<UserModel>(userId);
    }

    [Authorize(Roles = "taskCreator")]
    [HttpPatch("{userId}/add-points")]
    public async Task<UserModel> AddPointsToUserById(Guid userId, [FromBody] int points)
    {
        return await _userService.AddPointsToUserById(userId, points);
    }



}
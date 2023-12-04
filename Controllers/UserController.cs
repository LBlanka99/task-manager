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
        Response.Cookies.Append("id", user.Id.ToString(), cookieOptions);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
    
}
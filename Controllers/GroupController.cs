using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers;

[ApiController]
[Route("/api/v1/groups")]
[Authorize]
public class GroupController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<GroupModel> PostNewGroup(NewGroupDTO data)
    {
        if (string.IsNullOrWhiteSpace(data.UserName) || string.IsNullOrWhiteSpace(data.GroupName) || string.IsNullOrWhiteSpace(data.Password))
        {
            throw new ArgumentException("User name, group name and password are required fields!");
        }
        return await _groupService.CreateNewGroup(data);
    }

    [HttpGet("all-tasks/{groupId}")]
    public async Task<List<TaskModel>> GetAllTasksInAGroup(Guid groupId)
    {
        return await _groupService.GetAllTasksInAGroup(groupId);
    }

    [HttpGet("all-tags/{groupId}")]
    public async Task<List<TagModel>> GetAllTagsInAGroup(Guid groupId)
    {
        return await _groupService.GetAllTagsInAGroup(groupId);
    }

    [HttpGet("{userId}")]
    public async Task<GroupModel> GetGroupByUserId(Guid userId)
    {
        return await _groupService.GetGroupByUserId(userId);
    }
}
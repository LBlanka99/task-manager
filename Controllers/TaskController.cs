using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers;

[ApiController]
[Route("/api/v1/tasks")]
[Authorize]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost("{groupId}/new-task")]
    public async Task<TaskModel> PostNewTask(Guid groupId, [FromBody] TaskModel newTask)
    {
        return await _taskService.CreateNewTask(groupId, newTask);
    }
    
    [HttpGet("{groupId}")]
    public async Task<List<TaskModel>> GetAllTasksForAGroup(Guid groupId)
    {
        return await _taskService.GetTasksByGroupId(groupId);
    }
}
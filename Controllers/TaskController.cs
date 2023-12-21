using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Services.Interfaces;
using TaskStatus = TaskManager.Entities.Enums.TaskStatus;

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

    [Authorize(Roles = "taskCreator")]
    [HttpPost("{groupId}/new-task")]
    public async Task<TaskModel> PostNewTask(Guid groupId, [FromBody] TaskModel newTask)
    {
        return await _taskService.CreateNewTask(groupId, newTask);
    }
    
    [HttpGet("{taskId}")]
    public async Task<TaskModel> GetTaskById(Guid taskId)
    {
        return await _taskService.GetTaskById(taskId);
    }

    [Authorize(Roles = "taskCreator")]
    [HttpDelete("{taskId}")]
    public async Task DeleteTask(Guid taskId)
    {
        await _taskService.DeleteTask(taskId);
    }

    [Authorize(Roles = "taskCreator")]
    [HttpPut("{taskId}")]
    public async Task<TaskModel> PutTask(Guid taskId, [FromBody] TaskModel updatedTask)
    {
        return await _taskService.UpdateTask(taskId, updatedTask);
    }

    [HttpPatch("{taskId}/status-change")]
    public async Task<TaskModel> PatchStatusOfTask(Guid taskId, [FromBody] TaskStatus status)
    {
        return await _taskService.ChangeStatusOfTask(taskId, status);
    }
}
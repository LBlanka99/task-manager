using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskStatus = TaskManager.Entities.Enums.TaskStatus;

namespace TaskManager.Services.Interfaces;

public interface ITaskService
{
    Task<TaskModel> CreateNewTask(Guid groupId, TaskModel newTask);
    Task<TaskModel> GetTaskById(Guid taskId);
    Task DeleteTask(Guid taskId);
    Task<TaskModel> UpdateTask(Guid taskId, TaskModel updatedTask);
    Task<TaskModel> ChangeStatusOfTask(Guid taskId, TaskStatus status);
}
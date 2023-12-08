using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface ITaskService
{
    Task<TaskModel> CreateNewTask(Guid groupId, TaskModel newTask);
    Task<List<TaskModel>> GetTasksByGroupId(Guid groupId);
}
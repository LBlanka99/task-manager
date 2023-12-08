using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Entities.Models.Context;
using TaskManager.Services.Base;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class TaskService : TaskManagerService, ITaskService
{
    public TaskService(TaskManagerContext context) : base(context)
    {
    }

    public async Task<TaskModel> CreateNewTask(Guid groupId, TaskModel newTask)
    {

        GroupModel group = await FindEntityById<GroupModel>(groupId, g => g.Tasks);
        group.Tasks.Add(newTask);

        _context.Entry(group).State = EntityState.Modified;
        _context.Entry(newTask).State = EntityState.Added;

        await _context.SaveChangesAsync();

        return newTask;
    }
    
    public async Task<List<TaskModel>> GetTasksByGroupId(Guid groupId)
    {
        GroupModel group = await FindEntityById<GroupModel>(groupId, g => g.Tasks);
        return group.Tasks;
    }
}
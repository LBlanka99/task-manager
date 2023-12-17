using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;
using TaskManager.Entities.Models.Context;
using TaskManager.Exceptions;
using TaskManager.Services.Base;
using TaskManager.Services.Interfaces;
using TaskStatus = TaskManager.Entities.Enums.TaskStatus;

namespace TaskManager.Services;

public class TaskService : TaskManagerService, ITaskService
{
    public TaskService(TaskManagerContext context) : base(context)
    {
    }

    public async Task<TaskModel> CreateNewTask(Guid groupId, TaskModel newTask)
    {
        if (newTask.Assignees.Count < 1)
        {
            throw new ArgumentException("There should be at least 1 assignee for the task!");
        }
        
        GroupModel group = await FindEntityById<GroupModel>(groupId, g => g.Tasks);
        group.Tasks.Add(newTask);

        _context.Entry(group).State = EntityState.Modified;
        _context.Entry(newTask).State = EntityState.Added;

        await _context.SaveChangesAsync();

        return newTask;
    }
    
    public async Task<List<TaskModel>> GetTasksByGroupId(Guid groupId)
    {
        GroupModel? group = await _context.GroupModel.Include(g => g.Tasks).ThenInclude(t => t.Assignees)
            .Include(g => g.Tasks).ThenInclude(t => t.Tags).FirstOrDefaultAsync(g => g.Id == groupId);
        if (group is null)
        {
            throw new IdNotFoundException($"The group with the id {groupId} was not found.");
        }
        
        return group.Tasks;
    }

    public async Task DeleteTask(Guid taskId)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId);

        _context.Entry(task).State = EntityState.Deleted;

        await _context.SaveChangesAsync();
    }

    public async Task<TaskModel> UpdateTask(Guid taskId, TaskModel updatedTask)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId, g => g.Assignees, g => g.Tags);

        task.Title = updatedTask.Title;
        task.Deadline = updatedTask.Deadline;
        task.Assignees = updatedTask.Assignees;
        task.Points = updatedTask.Points;
        task.Tags = updatedTask.Tags;
        task.Description = updatedTask.Description;
        
        //remélem itt frissíti a usereket/tageket is....

        _context.Entry(task).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskModel> ChangeStatusOfTask(Guid taskId, TaskStatus status)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId);

        task.Status = status;

        _context.Entry(task).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return task;
    }
}
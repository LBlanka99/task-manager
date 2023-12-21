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
    
    public async Task<TaskModel> GetTaskById(Guid taskId)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId, t => t.Assignees, t => t.Tags);

        return task;
    }

    public async Task DeleteTask(Guid taskId)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId);

        _context.Entry(task).State = EntityState.Deleted;

        await _context.SaveChangesAsync();
    }

    public async Task<TaskModel> UpdateTask(Guid taskId, TaskModel updatedTask)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId, t => t.Assignees, t => t.Tags);

        task.Title = updatedTask.Title;
        task.Deadline = updatedTask.Deadline;
        task.Points = updatedTask.Points;
        task.Description = updatedTask.Description;
        
        // Update Assignees
        task.Assignees.Clear(); // Remove existing relationships
        await _context.SaveChangesAsync();
        foreach (var assignee in updatedTask.Assignees)
        {
            var existingAssignee = await _context.UserModel.FindAsync(assignee.Id);
            if (existingAssignee != null)
            {
                task.Assignees.Add(existingAssignee);
            }
        }

        // Update Tags
        task.Tags.Clear(); // Remove existing relationships
        await _context.SaveChangesAsync();
        foreach (var tag in updatedTask.Tags)
        {
            var existingTag = await _context.TagModel.FindAsync(tag.Id);
            if (existingTag != null)
            {
                task.Tags.Add(existingTag);
            }
        }

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskModel> ChangeStatusOfTask(Guid taskId, TaskStatus status)
    {
        TaskModel task = await FindEntityById<TaskModel>(taskId, t => t.Assignees, t => t.Tags);

        task.Status = status;

        _context.Entry(task).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return task;
    }
}
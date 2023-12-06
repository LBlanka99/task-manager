using TaskManager.Entities.Models.Context;
using TaskManager.Exceptions;

namespace TaskManager.Services.Base;

public class TaskManagerService
{
    protected readonly TaskManagerContext _context;

    public TaskManagerService(TaskManagerContext context)
    {
        _context = context;
    }
    
    public async Task<T> FindEntityById<T>(Guid id) where T : class
    {
        T? entity = await _context.Set<T>().FindAsync(id);

        if (entity is null)
        {
            throw new IdNotFoundException($"The {typeof(T).Name} with id {id} was not found.");
        }

        return entity;
    }
}
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
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
    
    public async Task<T> FindEntityById<T>(Guid id, params Expression<Func<T, object>>[] includes) where T : class
    {
        IQueryable<T> query = _context.Set<T>().AsQueryable();

        foreach (var include in includes)
        {
            query = query.Include(include);
        }

        T? entity = await query.FirstOrDefaultAsync(t => EF.Property<Guid>(t, "Id") == id);

        if (entity is null)
        {
            throw new IdNotFoundException($"The {typeof(T).Name} with id {id} was not found.");
        }

        return entity;
    }
}
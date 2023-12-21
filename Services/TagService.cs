using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.Models;
using TaskManager.Entities.Models.Context;
using TaskManager.Services.Base;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class TagService : TaskManagerService, ITagService
{
    public TagService(TaskManagerContext context) : base(context)
    {
    }

    public async Task<TagModel> CreateNewTag(Guid groupId, TagModel newTag)
    {
        GroupModel group = await FindEntityById<GroupModel>(groupId, g => g.Tags);
        group.Tags.Add(newTag);
        
        _context.Entry(group).State = EntityState.Modified;
        _context.Entry(newTag).State = EntityState.Added;

        await _context.SaveChangesAsync();

        return newTag;
    }

    public async Task DeleteTag(Guid tagId)
    {
        TagModel tag = await FindEntityById<TagModel>(tagId);

        _context.Entry(tag).State = EntityState.Deleted;

        await _context.SaveChangesAsync();
    }

    public async Task<TagModel> UpdateTag(Guid tagId, TagModel updatedTag)
    {
        TagModel tag = await FindEntityById<TagModel>(tagId);

        tag.Name = updatedTag.Name;
        tag.Color = updatedTag.Color;

        _context.Entry(tag).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return tag;
    }
}
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface ITagService
{
    Task<TagModel> CreateNewTag(Guid groupId, TagModel newTag);
    Task DeleteTag(Guid tagId);
    Task<TagModel> UpdateTag(Guid tagId, TagModel updatedTag);
}
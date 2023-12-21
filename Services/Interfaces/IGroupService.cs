using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface IGroupService
{
    Task<GroupModel?> GetGroupByName(string groupName);
    Task<GroupModel> CreateNewGroup(NewGroupDTO data);
    Task<GroupModel> GetGroupByUserId(Guid userId);
    Task<List<TaskModel>> GetAllTasksInAGroup(Guid groupId);
    Task<List<TagModel>> GetAllTagsInAGroup(Guid groupId);
}
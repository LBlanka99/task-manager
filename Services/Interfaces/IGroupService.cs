using TaskManager.Entities.DTOs;
using TaskManager.Entities.Models;

namespace TaskManager.Services.Interfaces;

public interface IGroupService
{
    Task<GroupModel?> GetGroupByName(string groupName);
    Task<GroupModel> CreateNewGroup(NewGroupDTO data);
}
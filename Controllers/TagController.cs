using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entities.Models;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers;

[ApiController]
[Route("/api/v1/tags")]
[Authorize]
public class TagController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpPost("{groupId}/new-tag")]
    public async Task<TagModel> PostNewTag(Guid groupId, [FromBody] TagModel newTag)
    {
        return await _tagService.CreateNewTag(groupId, newTag);
    }

    [HttpDelete("{tagId}")]
    public async Task DeleteTag(Guid tagId)
    {
        await _tagService.DeleteTag(tagId);
    }

    [HttpPut("{tagId}")]
    public async Task<TagModel> PutTag(Guid tagId, [FromBody] TagModel modifiedTag)
    {
        return await _tagService.UpdateTag(tagId, modifiedTag);
    }
}
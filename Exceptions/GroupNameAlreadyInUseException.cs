namespace TaskManager.Exceptions;

public class GroupNameAlreadyInUseException : Exception
{
    public GroupNameAlreadyInUseException(string? message) : base(message)
    {
    }
}
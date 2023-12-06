namespace TaskManager.Exceptions;

public class UserNameAlreadyInUseException : Exception
{
    public UserNameAlreadyInUseException(string? message) : base(message)
    {
    }
}
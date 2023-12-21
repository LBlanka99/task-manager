namespace TaskManager.Exceptions;

public class YouDontHaveEnoughPointsException : Exception
{
    public YouDontHaveEnoughPointsException(string? message) : base(message)
    {
    }
}
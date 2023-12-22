using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using TaskManager.Entities.Models.Context;
using TaskManager.Exceptions;
using TaskManager.Services;
using TaskManager.Services.Interfaces;

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:8100", "https://tenni-venni.hu")
                .AllowAnyHeader()
                .AllowCredentials()
                .AllowAnyMethod();
        });
});

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

builder.Services.AddDbContext<TaskManagerContext>(options =>
    options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<TaskManagerContext>();
builder.Services.AddTransient<IGroupService, GroupService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<ITaskService, TaskService>();
builder.Services.AddTransient<ITagService, TagService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();

var app = builder.Build();

app.Use(async (context, next) =>
{
    try
    {
        Console.WriteLine(context.Response.Body);
        await next.Invoke();
    }
    catch (IdNotFoundException e)
    {
        context.Response.StatusCode = 404;
        await context.Response.WriteAsync(e.Message);
    }
    catch (UserNameAlreadyInUseException e)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync(e.Message);
    }
    catch (ArgumentException e)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync(e.Message);
    }
    catch (GroupNameAlreadyInUseException e)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync(e.Message);
    }
    catch (GroupNotFoundException e)
    {
        context.Response.StatusCode = 404;
        await context.Response.WriteAsync(e.Message);
    }
    catch (UserNotFoundException e)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync(e.Message);
    }
    catch (IncorrectPasswordException e)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync(e.Message);
    }
    catch (YouDontHaveEnoughPointsException e)
    {
        context.Response.StatusCode = 404;
        await context.Response.WriteAsync(e.Message);
    }
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(myAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
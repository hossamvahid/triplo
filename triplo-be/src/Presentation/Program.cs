using log4net;
using log4net.Config;
using Microsoft.EntityFrameworkCore;
using src.Infrastructure.Contexts;
using src.Presentation;
using src.Presentation.Middlewares;

XmlConfigurator.Configure(new FileInfo("Presentation/Log/log.config"));
LogicalThreadContext.Properties["CorrelationId"]=Guid.NewGuid().ToString();
ILog log = LogManager.GetLogger("Server");

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddConfig();



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContextPgSQL = services.GetRequiredService<PgSqlDbContext>();
    dbContextPgSQL.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<StartRequestMiddleware>();
app.UseMiddleware<EndRequestMiddleware>();

app.UseAuthorization();
app.UseCors();
app.MapControllers();

log.Info("Server has started");

app.Run();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();

app.UsePathBase("/stockpiles");
app.UseRouting();
app.UseStaticFiles();
app.MapControllers();
app.MapFallback("/api/{**path}", () => Results.NotFound());
app.MapFallbackToFile("/{*path:nonfile}", "index.html");
app.Run();

public partial class Program { }

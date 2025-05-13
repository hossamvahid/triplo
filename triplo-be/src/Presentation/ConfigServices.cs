using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using src.Infrastructure.Contexts;
using src.Application.Interfaces.Repositories;
using src.Infrastructure.Repositories;
using src.Application.Interfaces.Services;
using src.Application.Implementation.Services;
using log4net;
using Minio;

namespace src.Presentation
{
    public static class ConfigServices
    {
        public static void AddConfig(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            
            services.AddDbContext<PgSqlDbContext>(opt => opt.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE")));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                 ValidIssuer = Environment.GetEnvironmentVariable("ISSUER"),
                 ValidAudience = Environment.GetEnvironmentVariable("AUDIENCE"),
                 IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("KEY"))),
                 ValidateIssuerSigningKey = true,
                 ValidateIssuer = true,
                 ValidateAudience = true,
                 ValidateLifetime = true,
                };
            });

            

            services.AddMinio(config =>
            {
                config.WithEndpoint(Environment.GetEnvironmentVariable("MinioEndpoint"))
                .WithCredentials(Environment.GetEnvironmentVariable("MinioKey"), Environment.GetEnvironmentVariable("MinioSecretKey"))
                .WithSSL(false)
                .Build();
            });

            services.AddScoped<IDapi, Dapi>();
            services.AddScoped<IAuthService,AuthService>();
            services.AddSingleton(LogManager.GetLogger("Server"));
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IMinioRepository, MinioRepository>();
            services.AddScoped<IAccommodationService, AccommodationService>();


        }
    }
}

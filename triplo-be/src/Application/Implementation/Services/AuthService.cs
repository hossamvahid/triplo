using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using src.Application.Interfaces.Repositories;
using src.Application.Interfaces.Services;
using src.Application.Utils;
using src.Domain.Entities;
using src.Domain.Enums;

namespace src.Application.Implementation.Services
{
    public class AuthService : IAuthService
    {
        private readonly IDapi _dapi;
        public AuthService(IDapi dapi) 
        { 
            _dapi = dapi; 
        }

        public async Task<(ServiceResult,string?)> RegisterUser(string email, string name , string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(password))
            {
                return new(ServiceResult.EMPTY_STRINGS, null);  
            }

            bool found = await _dapi.Users.Exists(email);

            if (found)
            {
                return new(ServiceResult.EMAIL_EXISTS, null);
            }

            password=PasswordHelper.EncryptPassword(password);

            var user = new User
            {
                Email = email,
                Name = name,
                Password = password
            };

            await _dapi.BeginTransactionAsync();
            try
            {
                await _dapi.Users.Add(user);
                await _dapi.CompleteAsync();
                await _dapi.CommitTransactionAsync();
            }
            catch (Exception ex)
            {
                await _dapi.RollbackTransactionAsync();
                throw;
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Role,Role.User.ToString()),
            };

            var token = TokenHelper.GenerateJwtToken(claims);

            return new(ServiceResult.OK, token);
            
        }



        public async Task<(ServiceResult,string?)> LoginUser(string email, string password)
        {
            if(string.IsNullOrWhiteSpace(email) || string.IsNullOrEmpty(password))
            {
                return (ServiceResult.EMPTY_STRINGS, null);
            }

            var adminToken= AdminHelper.VerifyAdmin(email, password);
            if(adminToken is not null)
            {
                return (ServiceResult.OK, adminToken);
            }

            var user = _dapi.Users.GetByEmailAsync(email).Result;

            if (user is null)
            {
                return (ServiceResult.INVALID_EMAIL, null);
            }

            if (PasswordHelper.VerifyPassword(password, user.Password) is false)
            {
                return (ServiceResult.INVALID_PASSWORD, null);
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var token = TokenHelper.GenerateJwtToken(claims);
            return new(ServiceResult.OK, token);

        }
    }
}

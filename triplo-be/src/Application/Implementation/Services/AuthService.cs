using System.Security.Claims;
using log4net;
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
        private readonly ILog _log;
        public AuthService(IDapi dapi,ILog log) 
        { 
            _dapi = dapi; 
            _log = log;
        }

        public async Task<(ServiceResult,string?)> RegisterUser(string email, string name , string password, string phone)
        {
            _log.Info($"Register the user with Email: {email} , Username: {name}");

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(password))
            {
                _log.Info("Request is empty");
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
                Password = password,
                PhoneNumber = phone
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
                new Claim(ClaimTypes.Email,email),
            };

            var token = TokenHelper.GenerateJwtToken(claims);

            return new(ServiceResult.OK, token);
            
        }



        public async Task<(ServiceResult,string?)> LoginUser(string email, string password)
        {
            _log.Info($"Login with Email: {email}");

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrEmpty(password))
            {
                return (ServiceResult.EMPTY_STRINGS, null);
            }

            var adminToken= AdminHelper.VerifyAdmin(email, password);
            if(adminToken is not null)
            {
                return (ServiceResult.OK, adminToken);
            }

            var user = await _dapi.Users.GetByEmailAsync(email);

            if (user is null)
            {
                return (ServiceResult.INVALID_EMAIL, null);
            }

            _log.Info($"Checking the password for the Email {email}");
            if (PasswordHelper.VerifyPassword(password, user.Password) is false)
            {
                _log.Info("Password was not correct");
                return (ServiceResult.INVALID_PASSWORD, null);
            }
            _log.Info($"Password is correct for the Email {email}");

            var claims = new[]
            {
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var token = TokenHelper.GenerateJwtToken(claims);
            return new(ServiceResult.OK, token);

        }
    }
}

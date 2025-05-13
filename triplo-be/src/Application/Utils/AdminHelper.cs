using src.Application.Implementation;
using src.Domain.Enums;
using System.Security.Claims;

namespace src.Application.Utils
{
    public static class AdminHelper
    {
        public static string VerifyAdmin(string email, string password)
        {
            if (email == Environment.GetEnvironmentVariable("ADMIN_EMAIL"))
            {
                if (password != Environment.GetEnvironmentVariable("ADMIN_PASS"))
                {
                    return null;
                }

                var adminClaims = new[]
                {
                    new Claim(ClaimTypes.Role, Role.Admin.ToString()),
                    new Claim(ClaimTypes.Email, email),
                };

                var adminToken = TokenHelper.GenerateJwtToken(adminClaims);
                return adminToken.ToString();
            }
            return null;
        }
    }
}

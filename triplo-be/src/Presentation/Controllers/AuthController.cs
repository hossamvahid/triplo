using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.Application.Interfaces.Repositories;
using src.Application.Interfaces.Services;
using src.Infrastructure.Contexts;
using src.Presentation.RequestModels;

namespace src.Presentation.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _service.RegisterUser(request.Email, request.Name, request.Password,request.Phone);

            if (result.Item2 is null)
            {
                return BadRequest(result.Item1.ToString());
            }

            return Ok(new { token = result.Item2 });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = _service.LoginUser(request.Email, request.Password).Result;

            if (result.Item2 is null)
            {
                return BadRequest(result.Item1.ToString());
            }

            return Ok(new {token = result.Item2});
        }


        [HttpGet("role")]
        [Authorize(Roles ="Admin,User")]
        public IActionResult GetRole()
        {
            var role = User.FindFirst(ClaimTypes.Role).Value;

            return Ok(new {Role = role});
        }
    }
}

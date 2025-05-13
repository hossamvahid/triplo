using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using src.Application.Implementation;
using src.Application.Interfaces.Services;
using src.Presentation.RequestModels;
using src.Presentation.ResponseModel;

namespace src.Presentation.Controllers
{
    [Route("api/v1/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("detail")]
        [Authorize(Roles = "User")]

        public async Task<IActionResult> GetUser()
        {
            var email = User.FindFirst(ClaimTypes.Email).Value;

            var result = await _service.GetUser(email);

            if (result.Item3 is null)
            {
                return NotFound(result.Item1.ToString());
            }

            var response = new UserDetail
            {
                Id = result.Item2,
                Email = email,
                Name = result.Item3,
                Phone = result.Item4
            };

            return Ok(response);
        }

        [HttpPut("update")]
        [Authorize(Roles ="User")]
        public async Task<IActionResult> ResetPassword(ResetPassword reset)
        {
            var email = User.FindFirst(ClaimTypes.Email).Value;

            var result = await _service.ResetPassword(email, reset.NewPassword);

            if(result.Equals(ServiceResult.OK))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("reservations")]

        public async Task<IActionResult> GetReservations(int page=1 ,int size=5)
        {
            var email = User.FindFirst(ClaimTypes.Email).Value;
            var result = await _service.GetAccomodations(email, page, size);

            if(result.Item1.Equals(ServiceResult.OK))
            {
                return Ok(new { Accomodations = result.Item2, total = result.Item3 });
            }

            return BadRequest(result.Item1.ToString());
        }

    }
}

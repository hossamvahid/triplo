using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using src.Application.Implementation;
using src.Application.Interfaces.Services;
using src.Domain.Enums;
using src.Presentation.RequestModels;

namespace src.Presentation.Controllers
{
    [Route("api/v1/accomodation")]
    [ApiController]
    public class AccommodationController : ControllerBase
    {
        private readonly IAccommodationService _service;

        public AccommodationController(IAccommodationService service)
        {
            _service = service;
        }

        [HttpPost("create")]

        public async Task<IActionResult> CreateAccomodation([FromForm] CreateAccomodationRequest request)
        {
            var result = await _service.CreateAccommodation(request.Name, request.Description, request.Address, request.City.Value, request.Photo);

            if(result.Equals(ServiceResult.OK) is true)
            {
                return Ok();
            }

            return BadRequest(result.ToString());
        }

        [HttpGet("paginate")]
        public async Task<IActionResult> Paginate(City cityFilter = City.NONE,int page=1,int size=6,DateOnly? startDate = null , DateOnly? endDate = null)
        {
            var result = await _service.Paginate(cityFilter,page,size,startDate,endDate);

            return Ok(new {totalPages = result.Item3, Accomodations = result.Item2});
        }

        [HttpPost("reservate")]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservation reservation)
        {
            var email = User.FindFirst(ClaimTypes.Email).Value;

            var result = await _service.Reservate(reservation.AccomodationId, email,reservation.StartDate,reservation.EndDate);

            return Ok();
        }

        [HttpGet("details")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var result = await _service.GetAccomodationDetails(id);

            if(result.Item2 is null)
            {
                return BadRequest(result.Item1.ToString());
            }

            return Ok(new {Accomodation=result.Item2});
        }



    }
}

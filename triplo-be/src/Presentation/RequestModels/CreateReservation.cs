﻿namespace src.Presentation.RequestModels
{
    public class CreateReservation
    {
        public int AccomodationId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}

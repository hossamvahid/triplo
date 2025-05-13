namespace src.Application.Implementation
{
    public enum ServiceResult
    {
        OK,
        EMPTY_STRINGS,
        INVALID_USERNAME,
        INVALID_PASSWORD,
        INVALID_EMAIL,
        EMAIL_EXISTS,
        EMAIL_NOT_FOUND,
        ID_NOT_FOUND,
        ACCOMODATION_EXISTS,
        MINIO_FAILED,
        ACCOMODATION_NOT_FOUND,
        RESERVATION_EXISTS,
        NO_RESERVATION
    }
}

export class TripReportRequestModel {
    fromDate: Date;
    toDate: Date;
    driverCode: string;
    passengerCode: string;
    status: string;

    constructor(
        fromDate: Date,
        toDate: Date,
        driverCode: string,
        passengerCode: string,
        status: string
    ) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.driverCode = driverCode;
        this.passengerCode = passengerCode;
        this.status = status;
    }
}
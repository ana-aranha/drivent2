import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);

  if(!ticketId) { return res.status(400).send("BAD REQUEST"); }
  try{
    const payment = await paymentsService.getPaymentByTicketId(ticketId, userId);
    res.status(200).send(payment);
  }catch(error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "BadRequest") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function postPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const cardData = req.body.cardData;
  const ticketId = req.body.ticketId;

  if(!cardData || !ticketId ) { return res.status(400).send("BAD REQUEST"); } 
  try {
    const payment = await paymentsService.postPayment(ticketId, userId, cardData.issuer, cardData.number );
    res.status(200).send(payment);
  }catch(error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

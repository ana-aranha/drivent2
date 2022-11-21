import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: Request, res: Response) {
  try{
    const ticketsType = await ticketsService.getTicketsTypeArr();

    return res.status(httpStatus.OK).send(ticketsType);
  }catch(error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req; 

  try {
    const tickets = await ticketsService.getTicketsByUserId(userId);
    return res.status(httpStatus.OK).send(tickets);
  }catch(error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId = req.body.ticketTypeId as number;
  const { userId } = req;

  try {
    const ticket = await ticketsService.createTicketByTicketTypeId(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticket);
  }catch(error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

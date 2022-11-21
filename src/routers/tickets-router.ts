import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsType, getTickets, postTicket } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsType)
  .get("/", getTickets)
  .post("/", postTicket);

export { ticketsRouter };

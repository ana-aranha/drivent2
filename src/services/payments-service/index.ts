import { notFoundError, requestError, unauthorizedError } from "@/errors";
import { cardData } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  if(!ticketId) throw requestError(400, "BadRequest");
  await findAndValidateTicket(ticketId, userId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);
  
  if(!payment) throw notFoundError();  
  
  return payment;
}

async function postPayment( ticketId: number, userId: number, cardData: cardData) {
  if(!ticketId || !cardData) throw requestError(400, "BadRequest");
  
  const ticket = await findAndValidateTicket(ticketId, userId);
  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);

  ticket.status = "PAID";
  await ticketsRepository.insertTicket(ticket);

  const payment = {
    ticketId: ticketId,
    value: ticketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4)
  };

  const newPayment = await paymentsRepository.insertPayment(payment);

  return newPayment;
}

async function findAndValidateTicket(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  
  if(!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);
  
  if(enrollment.userId !== userId) throw unauthorizedError();

  return ticket;
}

const paymentsService = {
  getPaymentByTicketId,
  postPayment
};

export default paymentsService;

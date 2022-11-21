import { notFoundError, requestError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  await findAndValidateTicket(ticketId, userId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);
  
  if(!payment) throw notFoundError();  
  
  return payment;
}

async function postPayment( ticketId: number, userId: number, cardIssuer: string, number: string) {
  const ticket = await findAndValidateTicket(ticketId, userId);
  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);

  ticket.status = "PAID";
  await ticketsRepository.insertTicket(ticket);

  const payment = {
    ticketId: ticketId,
    value: ticketType.price,
    cardIssuer: cardIssuer,
    cardLastDigits: number.slice(-4)
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

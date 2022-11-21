import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsTypeArr() {
  const result = await ticketsRepository.findTicketsType();

  if(!result) throw notFoundError();

  return result;
}

async function getTicketsByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);

  const result = { ...ticket, TicketType: ticketType };

  return result;
}

async function createTicketByTicketTypeId(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollment) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);

  const ticket = await ticketsRepository.insertTicket({ ticketTypeId: ticketTypeId, enrollmentId: enrollment.id, status: "RESERVED" });

  const result = { ...ticket, TicketType: ticketType };
  return result;
}

/*   const ticket = await ticketsRepository.findTicketByUserId(userId);*/

const ticketsService = {
  getTicketsTypeArr,
  getTicketsByUserId,
  createTicketByTicketTypeId
};

export default ticketsService;

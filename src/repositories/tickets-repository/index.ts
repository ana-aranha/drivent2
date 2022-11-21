import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findTicketsType() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId }
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: { id: id }
  });
}

async function insertTicket( ticket: NewTicket) {
  return prisma.ticket.upsert({
    where: { id: ticket.id || 0 },
    create: ticket as TicketParams,
    update: ticket
  }); 
} 

async function findTicketTypeById(id: number) {
  return prisma.ticketType.findUnique({
    where: { id }
  });
}

const ticketsRepository = {
  findTicketsType,
  findTicketByEnrollmentId,
  findTicketTypeById,
  insertTicket,
  findTicketById
};
export default ticketsRepository;

export type TicketParams = Omit <Ticket, "id"| "createdAt" | "updatedAt" >

export type NewTicket = Partial <Ticket>

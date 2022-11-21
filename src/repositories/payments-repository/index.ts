import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId: ticketId }
  });
}

async function insertPayment( payment: NewPayment) {
  return prisma.payment.upsert({
    where: { id: payment.id || 0 },
    create: payment as PaymentParams,
    update: payment
  }); 
} 

const paymentsRepository = {
  findPaymentByTicketId,
  insertPayment
};
export default paymentsRepository;

export type PaymentParams = Omit <Payment, "id"| "createdAt" | "updatedAt" >

export type NewPayment = Partial <Payment>


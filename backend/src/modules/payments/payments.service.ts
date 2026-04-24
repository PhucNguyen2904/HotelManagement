import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (['CANCELLED', 'REFUNDED'].includes(booking.status || '')) {
      throw new BadRequestException('Cannot add payment to this booking');
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        method: dto.method,
        status: 'COMPLETED',
        transactionRef: dto.transactionRef,
        notes: dto.notes,
        paidAt: new Date(),
      },
    });

    // Auto-confirm booking when payment received
    if (booking.status === 'PENDING') {
      await this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      });
    }

    return payment;
  }

  async findByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refund(paymentId: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only refund completed payments');
    }

    const refundAmount = amount || Number(payment.amount);

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: refundAmount < Number(payment.amount) ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
        refundedAt: new Date(),
        refundAmount: refundAmount,
      },
    });
  }
}

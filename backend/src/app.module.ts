import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Config & Infrastructure
import { appConfig } from './config';
import { PrismaModule } from './prisma';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { RoomTypesModule } from './modules/room-types/room-types.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';

// Controllers
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    HotelsModule,
    RoomTypesModule,
    RoomsModule,
    AvailabilityModule,
    BookingsModule,
    PaymentsModule,
  ],
  providers: [
    // Global JWT auth guard (use @Public() to skip)
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global roles guard (use @Roles() to require specific roles)
    { provide: APP_GUARD, useClass: RolesGuard },
    // Global rate limiter
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

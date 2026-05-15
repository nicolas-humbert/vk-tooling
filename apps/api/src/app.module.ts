import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ContactsModule } from './contacts/contacts.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ContactsModule,
    OrganizationsModule,
    PipelinesModule,
    OpportunitiesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

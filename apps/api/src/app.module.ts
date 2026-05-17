import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PipelinesModule } from './pipelines/pipelines.module';
import { ProjectsModule } from './projects/projects.module';
import { OdooModule } from './odoo/odoo.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, PipelinesModule, ProjectsModule, OdooModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

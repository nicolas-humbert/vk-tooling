import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OdooController } from './odoo.controller';
import { OdooService } from './odoo.service';
import { OdooSyncService } from './odoo.sync';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ScheduleModule.forRoot(), ProjectsModule],
  controllers: [OdooController],
  providers: [OdooService, OdooSyncService],
  exports: [OdooService],
})
export class OdooModule {}

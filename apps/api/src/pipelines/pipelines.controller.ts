import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  constructor(private pipelinesService: PipelinesService) {}

  @Get()
  findAll() {
    return this.pipelinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pipelinesService.findOne(id);
  }
}

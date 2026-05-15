import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { MoveStageDto } from './dto/move-stage.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private opportunitiesService: OpportunitiesService) {}

  @Get()
  findAll() {
    return this.opportunitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opportunitiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOpportunityDto, @CurrentUser() user: { sub: number }) {
    return this.opportunitiesService.create(dto, user.sub);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOpportunityDto) {
    return this.opportunitiesService.update(id, dto);
  }

  @Post(':id/transition')
  moveStage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MoveStageDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.opportunitiesService.moveStage(id, dto, user.sub);
  }
}

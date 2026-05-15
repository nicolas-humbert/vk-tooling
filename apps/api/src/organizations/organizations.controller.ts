import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }

  @Post(':id/contacts/:contactId')
  linkContact(
    @Param('id', ParseIntPipe) id: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.organizationsService.linkContact(id, contactId);
  }

  @Delete(':id/contacts/:contactId')
  @HttpCode(204)
  unlinkContact(
    @Param('id', ParseIntPipe) id: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.organizationsService.unlinkContact(id, contactId);
  }
}

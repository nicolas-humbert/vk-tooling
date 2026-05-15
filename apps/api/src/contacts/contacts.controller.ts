import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(id);
  }

  @Post(':id/organizations/:orgId')
  linkOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.contactsService.linkOrganization(id, orgId);
  }

  @Delete(':id/organizations/:orgId')
  @HttpCode(204)
  unlinkOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.contactsService.unlinkOrganization(id, orgId);
  }
}

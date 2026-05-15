import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

const include = {
  organizations: { include: { organization: true } },
};

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.contact.findMany({ include });
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({ where: { id }, include });
    if (!contact) throw new NotFoundException(`Contact ${id} not found`);
    return contact;
  }

  create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto, include });
  }

  async update(id: number, dto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contact.update({ where: { id }, data: dto, include });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.contact.delete({ where: { id } });
  }

  async linkOrganization(contactId: number, organizationId: number) {
    return this.prisma.contactOrganization.create({
      data: { contactId, organizationId },
    });
  }

  async unlinkOrganization(contactId: number, organizationId: number) {
    return this.prisma.contactOrganization.delete({
      where: { contactId_organizationId: { contactId, organizationId } },
    });
  }
}

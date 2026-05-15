import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const include = {
  contacts: { include: { contact: true } },
};

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.organization.findMany({ include });
  }

  async findOne(id: number) {
    const org = await this.prisma.organization.findUnique({ where: { id }, include });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: dto, include });
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    await this.findOne(id);
    return this.prisma.organization.update({ where: { id }, data: dto, include });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.organization.delete({ where: { id } });
  }

  async linkContact(organizationId: number, contactId: number) {
    return this.prisma.contactOrganization.create({
      data: { contactId, organizationId },
    });
  }

  async unlinkContact(organizationId: number, contactId: number) {
    return this.prisma.contactOrganization.delete({
      where: { contactId_organizationId: { contactId, organizationId } },
    });
  }
}

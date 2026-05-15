import 'dotenv/config';
import { PrismaClient, PipelineType, StageFinalType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sales = await prisma.pipeline.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Sales',
      type: PipelineType.SALES,
      stages: {
        create: [
          { name: 'Lead', order: 1 },
          { name: 'Qualification', order: 2 },
          { name: 'Discovery', order: 3 },
          { name: 'Proposal', order: 4 },
          { name: 'Negotiation', order: 5 },
          { name: 'Won', order: 6, isFinal: true, finalType: StageFinalType.WON },
          { name: 'Lost', order: 7, isFinal: true, finalType: StageFinalType.LOST },
        ],
      },
    },
  });

  const production = await prisma.pipeline.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Production',
      type: PipelineType.PRODUCTION,
      stages: {
        create: [
          { name: 'Pre-production', order: 1 },
          { name: 'Waiting Assets', order: 2 },
          { name: 'Editing', order: 3 },
          { name: 'Internal Review', order: 4 },
          { name: 'Client Review', order: 5 },
          { name: 'Revisions', order: 6 },
          { name: 'Delivery', order: 7 },
          { name: 'Completed', order: 8, isFinal: true, finalType: StageFinalType.COMPLETED },
          { name: 'Archived', order: 9, isFinal: true, finalType: StageFinalType.ARCHIVED },
        ],
      },
    },
  });

  console.log(`Seeded pipelines: ${sales.name} (id=${sales.id}), ${production.name} (id=${production.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

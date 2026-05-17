import 'dotenv/config';
import { PrismaClient, PipelineType, StageFinalType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const video = await prisma.pipeline.upsert({
    where: { name: 'Production Vidéo' },
    update: {},
    create: {
      name: 'Production Vidéo',
      type: PipelineType.PRODUCTION,
      stages: {
        create: [
          { name: 'Briefing', order: 1 },
          { name: 'Pré-production', order: 2 },
          { name: 'Tournage', order: 3 },
          { name: 'Montage', order: 4 },
          { name: 'Révision client', order: 5 },
          { name: 'Livraison', order: 6, isFinal: true, finalType: StageFinalType.COMPLETED },
          { name: 'Archivé', order: 7, isFinal: true, finalType: StageFinalType.ARCHIVED },
        ],
      },
    },
  });

  const dev = await prisma.pipeline.upsert({
    where: { name: 'Production Dev' },
    update: {},
    create: {
      name: 'Production Dev',
      type: PipelineType.PRODUCTION,
      stages: {
        create: [
          { name: 'Specs', order: 1 },
          { name: 'Dev', order: 2 },
          { name: 'Review', order: 3 },
          { name: 'Recette client', order: 4 },
          { name: 'Livraison', order: 5, isFinal: true, finalType: StageFinalType.COMPLETED },
          { name: 'Archivé', order: 6, isFinal: true, finalType: StageFinalType.ARCHIVED },
        ],
      },
    },
  });

  console.log(`Seeded pipelines: ${video.name} (id=${video.id}), ${dev.name} (id=${dev.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

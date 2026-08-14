import { db } from './index';
import { worlds } from './schema';

const seedWorlds = [
  {
    worldKey: 'starlight-loft',
    displayName: 'Starlight Loft',
    description: 'A cozy, neon-lit apartment overlooking a cyberpunk cityscape.',
    physicsConfig: { gravity: [0, -9.81, 0] },
    assetManifest: { glb: 'starlight-loft.glb', envMap: 'night-city.hdr' },
  },
  {
    worldKey: 'midnight-garden',
    displayName: 'Midnight Garden',
    description: 'An enchanted garden illuminated by glowing flora and fireflies.',
    physicsConfig: { gravity: [0, -9.81, 0] },
    assetManifest: { glb: 'midnight-garden.glb', envMap: 'moonlight.hdr' },
  },
  {
    worldKey: 'arcade-cabinet',
    displayName: 'Arcade Cabinet',
    description: 'Inside a retro 80s arcade machine with glowing grids.',
    physicsConfig: { gravity: [0, -9.81, 0] },
    assetManifest: { glb: 'arcade-cabinet.glb', envMap: 'arcade-light.hdr' },
  }
];

async function run() {
  console.log('Seeding worlds...');
  for (const world of seedWorlds) {
    await db.insert(worlds).values(world).onConflictDoNothing();
  }
  console.log('Seeding complete!');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

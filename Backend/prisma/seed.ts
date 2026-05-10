import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Initial User
  const user1 = await prisma.user.upsert({
    where: { email: 'test@traveloop.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'test@traveloop.com',
      password: 'hashed_password_placeholder',
      phoneNumber: '1234567890',
      city: 'New York',
      country: 'USA',
      bio: 'Travel enthusiast and explorer.',
      onboardingComplete: true,
      currency: "INR"
    },
  });

  console.log('User seeded:', user1.email);

  // 2. Seed Cities and GlobalActivities from JSON
  const citiesPath = path.join(__dirname, 'data', 'cities.json');
  if (!fs.existsSync(citiesPath)) {
    console.error('cities.json not found at:', citiesPath);
    return;
  }

  const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

  for (const city of citiesData.cities) {
    // Map JSON fields to Schema fields
    // Prepend state to description if available since it's not in the schema
    const cityDescription = `${city.state ? city.state + ', ' : ''}${city.description}\n\nBest Time to Visit: ${city.bestTime}\nFamous For: ${city.famousFor}`;
    
    const upsertedCity = await prisma.city.upsert({
      where: { name_country: { name: city.name, country: city.country } },
      update: {
        description: cityDescription,
        heroImage: city.image,
        averageBudget: city.avgBudget,
        popularityScore: city.popularity,
        latitude: city.latitude,
        longitude: city.longitude
      },
      create: {
        name: city.name,
        country: city.country,
        description: cityDescription,
        heroImage: city.image,
        averageBudget: city.avgBudget,
        popularityScore: city.popularity,
        latitude: city.latitude,
        longitude: city.longitude
      }
    });

    console.log(`City seeded: ${upsertedCity.name}`);

    // Seed GlobalActivities for this city
    if (city.activities && city.activities.length > 0) {
      for (const activity of city.activities) {
        const existingActivity = await prisma.globalActivity.findFirst({
          where: { 
            title: activity.title,
            cityId: upsertedCity.id
          }
        });

        if (existingActivity) {
          await prisma.globalActivity.update({
            where: { id: existingActivity.id },
            data: {
              description: activity.description,
              category: activity.category,
              image: activity.image,
              location: activity.duration
            }
          });
        } else {
          await prisma.globalActivity.create({
            data: {
              title: activity.title,
              description: activity.description,
              category: activity.category,
              image: activity.image,
              cityId: upsertedCity.id,
              location: `Duration: ${activity.duration} | Cost: ${activity.estimatedCost}`
            }
          });
        }
      }
      console.log(`  Seeded ${city.activities.length} global activities for ${upsertedCity.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    pool.end();
    process.exit(1);
  });

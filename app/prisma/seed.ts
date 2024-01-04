import { LockerSize, PrismaClient } from "@prisma/client";

const getRandomLockerSize = () => {
  const sizes = Object.values(LockerSize);
  const randomIndex = Math.floor(Math.random() * sizes.length);
  const size = sizes[randomIndex];
  if (!size) throw new Error("No locker size found");
  return size;
};

const prisma = new PrismaClient();
const main = async () => {
  // Create 10 parcel machines with 10 lockers each
  for (let i = 0; i < 10; i++) {
    await prisma.parcelMachine.upsert({
      where: { name: `Parcel Machine ${i}` },
      update: {},
      create: {
        name: `Parcel Machine ${i}`,
        address: {
          create: {
            street: `Street ${i}`,
            city: `City ${i}`,
            postalCode: `Postal Code ${i}`,
            country: "Latvia",
          },
        },
        lockers: {
          create: Array.from({ length: 10 }, () => ({
            size: getRandomLockerSize(),
          })),
        },
      },
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

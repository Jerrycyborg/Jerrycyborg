import { prisma, Role } from '../src';

async function main() {
  await prisma.plan.createMany({
    data: [
      {
        code: 'basic',
        priceInr: 1499,
        visitsPerMonth: 0,
        features: ['Daily check-ins', 'SOS alerts']
      },
      {
        code: 'standard',
        priceInr: 2999,
        visitsPerMonth: 1,
        features: ['Includes basic features', '1 caregiver visit per month']
      },
      {
        code: 'premium',
        priceInr: 4999,
        visitsPerMonth: 3,
        features: ['Priority scheduling', '3 visits', 'Errand support']
      }
    ],
    skipDuplicates: true
  });

  const child = await prisma.user.upsert({
    where: { email: 'child@pariconnect.test' },
    update: {},
    create: {
      id: 'seed-child',
      email: 'child@pariconnect.test',
      role: Role.CHILD
    }
  });

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@pariconnect.test' },
    update: {},
    create: {
      id: 'seed-parent-user',
      email: 'parent@pariconnect.test',
      role: Role.PARENT
    }
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      id: 'parent-seed',
      userId: parentUser.id,
      name: 'Lakshmi Raman',
      language: 'ta',
      timezone: 'Asia/Kolkata',
      address: 'Chennai, TN',
      emergencyContact: '+91-90000-11111'
    }
  });

  await prisma.parentChild.upsert({
    where: { id: 'seed-parent-child' },
    update: {
      parentId: parent.id,
      childId: child.id,
      scope: 'MANAGE'
    },
    create: {
      id: 'seed-parent-child',
      parentId: parent.id,
      childId: child.id,
      scope: 'MANAGE'
    }
  });

  const caregiverUser = await prisma.user.upsert({
    where: { email: 'caregiver@pariconnect.test' },
    update: {},
    create: {
      id: 'seed-caregiver-user',
      email: 'caregiver@pariconnect.test',
      role: Role.CAREGIVER
    }
  });

  const caregiver = await prisma.caregiver.upsert({
    where: { userId: caregiverUser.id },
    update: {},
    create: {
      id: 'caregiver-seed',
      userId: caregiverUser.id,
      fullName: 'Priya Srinivasan',
      zone: 'Chennai South',
      kycId: 'TN-CARE-001',
      kycStatus: 'APPROVED'
    }
  });

  const caregiverTwoUser = await prisma.user.upsert({
    where: { email: 'caregiver2@pariconnect.test' },
    update: {},
    create: {
      id: 'caregiver-2-user',
      email: 'caregiver2@pariconnect.test',
      role: Role.CAREGIVER
    }
  });

  await prisma.caregiver.upsert({
    where: { userId: caregiverTwoUser.id },
    update: {},
    create: {
      id: 'caregiver-2',
      userId: caregiverTwoUser.id,
      fullName: 'Mani Narayanan',
      zone: 'Chennai Central',
      kycId: 'TN-CARE-002',
      kycStatus: 'APPROVED'
    }
  });

  await prisma.checkIn.createMany({
    data: [
      { parentId: parent.id, mood: 'happy', note: 'Morning walk completed' },
      { parentId: parent.id, mood: 'ok', note: 'Feeling a little tired today' }
    ]
  });

  await prisma.visit.createMany({
    data: [
      {
        id: 'visit-scheduled',
        parentId: parent.id,
        caregiverId: caregiver.id,
        type: 'companion',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 2 * 24 * 3600 * 1000)
      },
      {
        id: 'visit-completed',
        parentId: parent.id,
        caregiverId: caregiver.id,
        type: 'errand',
        status: 'completed',
        scheduledAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        startAt: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 3600 * 1000),
        endAt: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 7200 * 1000),
        consentPhoto: true
      },
      {
        id: 'visit-no-show',
        parentId: parent.id,
        caregiverId: caregiver.id,
        type: 'escort',
        status: 'no_show',
        scheduledAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
      }
    ],
    skipDuplicates: true
  });

  await prisma.feedback.createMany({
    data: [
      {
        id: 'feedback-1',
        visitId: 'visit-completed',
        childId: child.id,
        rating: 5,
        comments: 'Great visit, Amma appreciated the tea break.'
      },
      {
        id: 'feedback-2',
        visitId: 'visit-no-show',
        childId: child.id,
        rating: 2,
        comments: 'Caregiver reported traffic delay. Please monitor.'
      }
    ],
    skipDuplicates: true
  });

  await prisma.subscription.upsert({
    where: { id: 'seed-subscription' },
    update: {},
    create: {
      id: 'seed-subscription',
      childId: child.id,
      parentId: parent.id,
      planId: (await prisma.plan.findFirst({ where: { code: 'standard' } }))!.id,
      status: 'active',
      paymentProvider: 'stripe',
      currentPeriodEnd: new Date(Date.now() + 25 * 24 * 3600 * 1000)
    }
  });

  await prisma.payment.createMany({
    data: [
      {
        id: 'seed-payment-1',
        subscriptionId: 'seed-subscription',
        childId: child.id,
        amountInr: 2999,
        currency: 'INR',
        status: 'succeeded',
        provider: 'stripe',
        providerRef: 'pi_seed_1'
      }
    ],
    skipDuplicates: true
  });

  await prisma.alert.upsert({
    where: { id: 'seed-alert' },
    update: {},
    create: {
      id: 'seed-alert',
      parentId: parent.id,
      type: 'sos',
      message: 'Chest discomfort reported during check-in'
    }
  });

  console.info('Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

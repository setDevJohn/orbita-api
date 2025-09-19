import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      name: 'Dev Master',
      email: 'setdevjohn@gmail.com',
      password: '$2a$10$hTIrcEegN12kh4XPifO7O.26O0Hl0bKphqnchVpTNCCqFZz8XF28i',
      cellPhone: '11948127577',
      wage: 3000.00,
      payday: 5,
    },
  });

  const account = await prisma.accounts.create({
    data: {
      name: 'Conta Corrente',
      balance: 2500.00,
      userId: user.id,
    },
  });

  const card = await prisma.cards.create({
    data: {
      name: 'Cartão Nubank',
      creditLimit: 3000.00,
      closingDay: 10,
      dueDay: 20,
      userId: user.id,
    },
  });

  const category = await prisma.categories.create({
    data: {
      name: 'Geral',
      userId: user.id,
    },
  });

  await prisma.transactions.create({
    data: {
      name: 'Supermercado',
      type: 'expense',
      amount: 250.75,
      transactionDate: new Date(),
      source: 'account',
      referenceMonth: new Date().getMonth() + 1,
      referenceYear: new Date().getFullYear(),
      userId: user.id,
      categoryId: category.id,
      accountId: account.id,
      isApplied: true,
    },
  });

  await prisma.transactions.create({
    data: {
      name: 'Notebook',
      type: 'expense',
      amount: 250.00,
      transactionDate: new Date(),
      source: 'card',
      referenceMonth: new Date().getMonth() + 1,
      referenceYear: new Date().getFullYear(),
      currenInstallment: 1,
      totalInstallments: 10,
      userId: user.id,
      categoryId: category.id,
      cardId: card.id,
      isApplied: false,
    },
  });

  await prisma.settings.create({
    data: {
      userId: user.id,
      data: {
        theme: 'dark',
        notifications: true,
        currency: 'BRL',
        transactionPosting: 'after-closing'
      },
    },
  });
}

main()
  .then(async () => {
    console.log('Seed executado com sucesso!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

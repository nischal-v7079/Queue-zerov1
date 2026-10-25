import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding QueueZero (Q-Zero) Campus Database...');

  // Clean existing records
  await prisma.verificationRecord.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.printOrder.deleteMany();
  await prisma.pickupSlot.deleteMany();
  await prisma.printSetting.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.kiosk.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const studentPassword = await bcrypt.hash('password123', salt);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const operatorPassword = await bcrypt.hash('operator123', salt);

  // 1. Create Demo Users
  const student = await prisma.user.create({
    data: {
      email: 'nischal.26bes7079@vitapstudent.ac.in',
      passwordHash: studentPassword,
      role: 'STUDENT',
      name: 'Nischal Chowdary',
      rollNumber: '26BES7079',
      department: 'School of Computer Science and Engineering (SCOPE)',
      phone: '+91 9848022338',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      studentProfile: {
        create: {
          universityCardId: 'UCID-26BES7079',
          year: '3rd Year B.Tech CSE',
          balance: 245.50,
          loyaltyPoints: 180,
          defaultDuplex: true,
          defaultColor: false
        }
      }
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@vitap.ac.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      name: 'Dr. A. Sharma',
      rollNumber: 'EMP-ADM-042',
      department: 'VIT-AP Campus IT & Auxiliary Services',
      phone: '+91 9440112233'
    }
  });

  const operator = await prisma.user.create({
    data: {
      email: 'operator@vitap.ac.in',
      passwordHash: operatorPassword,
      role: 'OPERATOR',
      name: 'Ramesh Kumar',
      rollNumber: 'EMP-OPS-108',
      department: 'Central Block (CB) Fleet Operations Desk',
      phone: '+91 9988776655'
    }
  });

  console.log('✅ Demo Users created:');
  console.log('   - Student: nischal.26bes7079@vitapstudent.ac.in / password123');
  console.log('   - Admin: admin@vitap.ac.in / admin123');
  console.log('   - Operator: operator@vitap.ac.in / operator123');

  // 2. Create Campus Kiosks (VIT-AP University: AB1, AB2, CB, MH3, LH3, ROCK PLAZA - All Inside Building)
  const kiosksData = [
    {
      name: 'Academic Block 1 (AB-1)',
      campusCode: 'VITAP-AB1',
      location: 'Inside AB-1 Building • Ground Floor West Wing Indoor Lobby (Near SCOPE & VSB)',
      description: 'Indoor high-speed duplex print hub inside Sarvepalli Radhakrishnan Block (AB-1)',
      latitude: 16.49655,
      longitude: 80.49875,
      status: 'ONLINE',
      paperLevelPercent: 92,
      tonerLevelPercent: 86,
      queueDepth: 1,
      ppmSpeed: 45,
      activeQueueCapacity: 40,
      operatorName: 'Priya V. (AB-1 Indoor Desk)'
    },
    {
      name: 'Academic Block 2 (AB-2)',
      campusCode: 'VITAP-AB2',
      location: 'Inside AB-2 Building • Ground Floor East Wing Indoor Atrium (Near Science Labs)',
      description: 'Indoor thesis, dissertation and high-volume binder station inside APJ Abdul Kalam Block (AB-2)',
      latitude: 16.49740,
      longitude: 80.50020,
      status: 'ONLINE',
      paperLevelPercent: 96,
      tonerLevelPercent: 92,
      queueDepth: 0,
      ppmSpeed: 50,
      activeQueueCapacity: 40,
      operatorName: 'Suresh M. (AB-2 Indoor Desk)'
    },
    {
      name: 'Central Block (CB)',
      campusCode: 'VITAP-CB',
      location: 'Inside Central Block (CB) • Ground Floor Indoor Main Foyer & Food Court Hall',
      description: 'Primary indoor high-speed duplex print hub inside 10-storey Mahatma Gandhi Central Block',
      latitude: 16.49520,
      longitude: 80.49945,
      status: 'ONLINE',
      paperLevelPercent: 94,
      tonerLevelPercent: 88,
      queueDepth: 2,
      ppmSpeed: 50,
      activeQueueCapacity: 50,
      operatorName: 'Ramesh Kumar (CB Indoor Desk A)'
    },
    {
      name: 'Men\'s Hostel 3 (MH-3)',
      campusCode: 'VITAP-MH3',
      location: 'Inside MH-3 Building • Ground Floor Indoor Reception & Common Study Room',
      description: '24/7 indoor express pickup lockers inside Men\'s Hostel Block 3 for safe night-time prints',
      latitude: 16.49250,
      longitude: 80.49770,
      status: 'ONLINE',
      paperLevelPercent: 84,
      tonerLevelPercent: 78,
      queueDepth: 3,
      ppmSpeed: 35,
      activeQueueCapacity: 30,
      operatorName: 'MH-3 Indoor Security Desk'
    },
    {
      name: 'Ladies\' Hostel 3 (LH-3)',
      campusCode: 'VITAP-LH3',
      location: 'Inside LH-3 Building • Ground Floor Indoor Recreation Foyer & Study Hall',
      description: '24/7 autonomous indoor quick-scan release terminal inside Ladies\' Hostel Block 3',
      latitude: 16.49180,
      longitude: 80.50170,
      status: 'ONLINE',
      paperLevelPercent: 90,
      tonerLevelPercent: 85,
      queueDepth: 1,
      ppmSpeed: 35,
      activeQueueCapacity: 30,
      operatorName: 'LH-3 Indoor Warden Desk'
    },
    {
      name: 'Rock Plaza',
      campusCode: 'VITAP-ROCK',
      location: 'Inside Rock Plaza Pavilion • Indoor Dining & Student Services Building Center',
      description: 'Inside indoor student amenities complex at Rock Plaza with solar-assisted fast queue release',
      latitude: 16.49380,
      longitude: 80.49890,
      status: 'BUSY',
      paperLevelPercent: 76,
      tonerLevelPercent: 70,
      queueDepth: 4,
      ppmSpeed: 40,
      activeQueueCapacity: 35,
      operatorName: 'Rock Plaza Indoor Desk'
    }
  ];

  const kiosks = [];
  for (const k of kiosksData) {
    const createdKiosk = await prisma.kiosk.create({ data: k });
    kiosks.push(createdKiosk);
  }
  console.log(`✅ Created ${kiosks.length} Campus Kiosks`);

  // 3. Create Pickup Slots for Kiosks
  const now = new Date();
  const cbKiosk = kiosks.find(k => k.campusCode === 'VITAP-CB') || kiosks[0];
  const ab1Kiosk = kiosks.find(k => k.campusCode === 'VITAP-AB1') || kiosks[1];
  const centralKiosk = cbKiosk;

  for (const kiosk of kiosks) {
    for (let offset = 0; offset < 3; offset++) {
      const slotDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
      for (const hour of [9, 11, 14, 16, 17]) {
        await prisma.pickupSlot.create({
          data: {
            kioskId: kiosk.id,
            startTime: new Date(slotDay.getFullYear(), slotDay.getMonth(), slotDay.getDate(), hour, 0, 0),
            endTime: new Date(slotDay.getFullYear(), slotDay.getMonth(), slotDay.getDate(), hour, 45, 0),
            capacity: 10,
            bookedCount: Math.floor(Math.random() * 5),
            isAvailable: true
          }
        });
      }
    }
  }

  // 4. Create Sample Documents for Student
  const doc1 = await prisma.document.create({
    data: {
      userId: student.id,
      fileName: 'ai_systems_lab_manual.pdf',
      originalName: 'AI_Systems_Lab_Manual_Final.pdf',
      fileSize: 2458291,
      fileType: 'application/pdf',
      pageCount: 14,
      isColorDetected: false,
      fileUrl: '/uploads/sample_lab_manual.pdf',
      printSettings: {
        create: {
          colorMode: 'BW',
          duplexMode: 'DOUBLE',
          paperSize: 'A4',
          orientation: 'PORTRAIT',
          pageRange: 'ALL',
          oddEven: 'ALL',
          copies: 1,
          includeTrackingMargin: true,
          bindingOption: 'CORNER_STAPLE',
          calculatedPrice: 19.50
        }
      }
    },
    include: { printSettings: true }
  });

  const doc2 = await prisma.document.create({
    data: {
      userId: student.id,
      fileName: 'operating_systems_notes.pdf',
      originalName: 'OS_Module_4_Deadlocks_Notes.pdf',
      fileSize: 1540112,
      fileType: 'application/pdf',
      pageCount: 8,
      isColorDetected: true,
      fileUrl: '/uploads/sample_os_notes.pdf',
      printSettings: {
        create: {
          colorMode: 'COLOR',
          duplexMode: 'SINGLE',
          paperSize: 'A4',
          orientation: 'PORTRAIT',
          pageRange: 'ALL',
          oddEven: 'ALL',
          copies: 1,
          includeTrackingMargin: true,
          bindingOption: 'NONE',
          calculatedPrice: 56.00
        }
      }
    },
    include: { printSettings: true }
  });

  const doc3 = await prisma.document.create({
    data: {
      userId: student.id,
      fileName: 'intermediate_marks_memo.pdf',
      originalName: 'Pass_Certificate_Memorandum_Marks.pdf',
      fileSize: 845210,
      fileType: 'application/pdf',
      pageCount: 1,
      isColorDetected: true,
      fileUrl: '/uploads/sample_marks_memo.pdf',
      printSettings: {
        create: {
          colorMode: 'COLOR',
          duplexMode: 'SINGLE',
          paperSize: 'A4',
          orientation: 'PORTRAIT',
          pageRange: '1',
          oddEven: 'ALL',
          copies: 2,
          includeTrackingMargin: true,
          bindingOption: 'NONE',
          calculatedPrice: 14.00
        }
      }
    },
    include: { printSettings: true }
  });

  // 5. Create Realistic Sample Orders
  // Order 1: READY_FOR_PICKUP (Matches prompt example 8XUI-Z123)
  const order1 = await prisma.printOrder.create({
    data: {
      trackingCode: '8XUI-Z123',
      userId: student.id,
      documentId: doc1.id,
      printSettingsId: doc1.printSettings!.id,
      kioskId: centralKiosk.id,
      printMode: 'SCHEDULED',
      status: 'READY_FOR_PICKUP',
      priorityScore: 3.82,
      estimatedPrintTimeSec: 24,
      totalPages: 14,
      amount: 19.50,
      currency: 'INR',
      pickupWindowStart: new Date(now.getTime() - 10 * 60 * 1000),
      pickupWindowEnd: new Date(now.getTime() + 50 * 60 * 1000),
      payment: {
        create: {
          userId: student.id,
          amount: 19.50,
          currency: 'INR',
          method: 'WALLET',
          status: 'SUCCESS',
          transactionId: 'TXN-WAL-994821',
          receiptNumber: 'RCP-88412-01'
        }
      }
    }
  });

  // Order 2: PRINTING
  await prisma.printOrder.create({
    data: {
      trackingCode: '4TRK-B981',
      userId: student.id,
      documentId: doc2.id,
      printSettingsId: doc2.printSettings!.id,
      kioskId: ab1Kiosk.id, // AB-1 kiosk
      printMode: 'INSTANT',
      status: 'PRINTING',
      priorityScore: 5.40,
      estimatedPrintTimeSec: 32,
      totalPages: 8,
      amount: 56.00,
      currency: 'INR',
      pickupWindowStart: new Date(now.getTime() + 15 * 60 * 1000),
      pickupWindowEnd: new Date(now.getTime() + 60 * 60 * 1000),
      payment: {
        create: {
          userId: student.id,
          amount: 56.00,
          currency: 'INR',
          method: 'RAZORPAY_SANDBOX',
          status: 'SUCCESS',
          transactionId: 'TXN-RZP-339182',
          receiptNumber: 'RCP-88412-02'
        }
      }
    }
  });

  // Order 3: COLLECTED
  await prisma.printOrder.create({
    data: {
      trackingCode: '9MNQ-K412',
      userId: student.id,
      documentId: doc3.id,
      printSettingsId: doc3.printSettings!.id,
      kioskId: centralKiosk.id,
      printMode: 'SCHEDULED',
      status: 'COLLECTED',
      priorityScore: 1.25,
      estimatedPrintTimeSec: 12,
      totalPages: 2,
      amount: 14.00,
      currency: 'INR',
      collectedAt: new Date(now.getTime() - 24 * 3600 * 1000),
      payment: {
        create: {
          userId: student.id,
          amount: 14.00,
          currency: 'INR',
          method: 'WALLET',
          status: 'SUCCESS',
          transactionId: 'TXN-WAL-772619',
          receiptNumber: 'RCP-88412-03'
        }
      },
      verificationRecord: {
        create: {
          operatorId: operator.id,
          studentRollNoVerified: true,
          cardVerified: true,
          envelopeCodeVerified: true,
          otpVerified: false,
          verificationNotes: 'Handover complete. Student ID 26BES7079 confirmed at Central Block (CB).'
        }
      }
    }
  });

  // 6. Create Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: 'Your Print Is Ready! 🎉',
        message: 'Order #8XUI-Z123 is printed and sealed at Central Block (CB). Show your ID for quick collection.',
        type: 'READY_FOR_PICKUP',
        isRead: false,
        link: '/orders/8XUI-Z123'
      },
      {
        userId: student.id,
        title: 'Hardware Printing Started 🖨️',
        message: 'Order #4TRK-B981 is being printed at Academic Block 1 (AB-1) (High Priority Mode).',
        type: 'ORDER_CONFIRMED',
        isRead: false,
        link: '/orders/4TRK-B981'
      },
      {
        userId: student.id,
        title: 'Payment Successful 💳',
        message: '₹19.50 deducted from your campus wallet for Order #8XUI-Z123.',
        type: 'PAYMENT_SUCCESS',
        isRead: true,
        link: '/wallet'
      },
      {
        userId: student.id,
        title: 'Welcome to QueueZero! 🚀',
        message: 'Say goodbye to campus print lines! You have ₹245.50 in your smart printing wallet.',
        type: 'SYSTEM',
        isRead: true,
        link: '/dashboard'
      }
    ]
  });

  console.log('✅ Sample Orders, Documents, and Notifications created!');
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all reservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        menuItem: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// POST a new reservation
export async function POST(request) {
  try {
    const { customerName, contact, menuItem, quantity, dateTime, partySize, notes } = await request.json();

    if (!customerName || !contact || !menuItem || !quantity || !dateTime || !partySize) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    const menuItemRecord = await prisma.menuItem.findUnique({
      where: { id: parseInt(menuItem) },
    });

    if (!menuItemRecord) {
      return NextResponse.json(
        { error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    if (parseInt(quantity) < 1 || parseInt(partySize) < 1) {
      return NextResponse.json(
        { error: 'Quantity and party size must be positive numbers' },
        { status: 400 }
      );
    }

    if (isNaN(Date.parse(dateTime))) {
      return NextResponse.json(
        { error: 'Invalid date-time format' },
        { status: 400 }
      );
    }

    const newReservation = await prisma.reservation.create({
      data: {
        customerName,
        contact,
        menuItemId: parseInt(menuItem),
        quantity: parseInt(quantity),
        dateTime: new Date(dateTime),
        partySize: parseInt(partySize),
        notes: notes || null,
        status: 'pending',
      },
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

// PUT update reservation
export async function PUT(request) {
  try {
    const { id, customerName, contact, menuItem, quantity, dateTime, partySize, notes, status } = await request.json();

    if (!id || !customerName || !contact || !menuItem || !quantity || !dateTime || !partySize || !status) {
      return NextResponse.json(
        { error: 'All fields including ID and status are required' },
        { status: 400 }
      );
    }

    const menuItemRecord = await prisma.menuItem.findUnique({
      where: { id: parseInt(menuItem) },
    });

    if (!menuItemRecord) {
      return NextResponse.json(
        { error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    if (parseInt(quantity) < 1 || parseInt(partySize) < 1) {
      return NextResponse.json(
        { error: 'Quantity and party size must be positive numbers' },
        { status: 400 }
      );
    }

    if (isNaN(Date.parse(dateTime))) {
      return NextResponse.json(
        { error: 'Invalid date-time format' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        customerName,
        contact,
        menuItemId: parseInt(menuItem),
        quantity: parseInt(quantity),
        dateTime: new Date(dateTime),
        partySize: parseInt(partySize),
        notes: notes || null,
        status,
      },
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// DELETE reservation
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.reservation.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Reservation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting reservation:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}

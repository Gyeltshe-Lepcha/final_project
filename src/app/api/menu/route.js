import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST a new menu item
export async function POST(request) {
  try {
    const { name, price, currency, category, image } = await request.json()

    if (!name || !price || !currency || !category) {
      return NextResponse.json(
        { error: 'Name, price, currency, and category are required' },
        { status: 400 }
      )
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        currency, // Added currency field
        category,
        image: image || null,
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

// PUT (update) a menu item
export async function PUT(request) {
  try {
    const { id, name, price, currency, category, image } = await request.json()

    if (!id || !name || !price || !currency || !category) {
      return NextResponse.json(
        { error: 'ID, name, price, currency, and category are required' },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
        currency, // Added currency field
        category,
        image: image || null,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

// DELETE a menu item
export async function DELETE(request) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    console.log('Delete request body:', requestBody);
    
    const { id } = requestBody;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID_REQUIRED',
          message: 'ID is required for deletion'
        },
        { status: 400 }
      );
    }

    // Convert ID to number
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'INVALID_ID_FORMAT',
          message: 'ID must be a number'
        },
        { status: 400 }
      );
    }

    // Attempt deletion
    const deletedItem = await prisma.menuItem.delete({
      where: { id: numericId },
    });

    return NextResponse.json(
      { 
        success: true,
        data: deletedItem
      },
      { status: 200 }
    );

  } catch (error) {
    // Enhanced error logging
    console.error('DELETE Error Details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      meta: error.meta
    });

    // Specific handling for Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false,
          error: 'ITEM_NOT_FOUND',
          message: 'Menu item not found'
        },
        { status: 404 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: 'DELETE_FAILED',
        message: error.message || 'Failed to delete menu item'
      },
      { status: 500 }
    );
  }
}
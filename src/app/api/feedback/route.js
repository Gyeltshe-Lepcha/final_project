import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(feedbacks, { status: 200 })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { name, profession, rating, feedback } = await request.json()
    
    // Basic validation
    if (!name || !profession || !rating || !feedback) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        profession,
        rating: parseInt(rating),
        feedback
      }
    })

    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
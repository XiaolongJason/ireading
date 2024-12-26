import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findFirst({
      where: {
        id: parseInt(params.id),
        isDeleted: false
      },
      include: {
        pages: {
          where: {
            isDeleted: false
          },
          orderBy: {
            pageNumber: 'asc'
          }
        }
      }
    });
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - 更新图书信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const book = await prisma.book.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        ...data,
        updateDate: new Date()
      }
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

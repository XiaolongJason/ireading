import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/books
export async function GET() {
  try {
    console.log('Fetching books...');
    const books = await prisma.book.findMany({
      where: {
        isDeleted: false
      },
      include: {
        pages: {
          where: {
            isDeleted: false
          }
        }
      },
      orderBy: {
        updateDate: 'desc'
      }
    });
    console.log('Books found:', books);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// DELETE /api/books
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // 逻辑删除图书及其页面
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
        pages: {
          updateMany: {
            where: { bookId: Number(id) },
            data: { isDeleted: true }
          }
        }
      }
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

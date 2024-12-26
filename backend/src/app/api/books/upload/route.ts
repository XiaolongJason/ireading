import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const ageRange = formData.get('ageRange') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (!title || !author || !description || !ageRange) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 保存 PDF 文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'pdfs');
    await mkdir(uploadDir, { recursive: true });
    const pdfPath = join(uploadDir, `${Date.now()}-${file.name}`);
    await writeFile(pdfPath, buffer);

    // 创建图书记录
    const now = new Date();
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        ageRange,
        uploadDate: now,
        updateDate: now,
        isDeleted: false,
        coverImage: '', // 暂时为空，后面会更新
      }
    });

    // 处理 PDF 文件
    const pdfDoc = await PDFDocument.load(buffer);
    const pagesData = [];
    const imageDir = join(process.cwd(), 'public', 'uploads', 'images', book.id.toString());
    await mkdir(imageDir, { recursive: true });

    // 遍历 PDF 页面并转换为图片
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPages()[i];
      const imageName = `page-${Date.now()}-${i + 1}.png`;
      const imagePath = join(imageDir, imageName);

      // 将 PDF 页面转换为图片
      // 注意：这里需要实现 PDF 页面到图片的转换
      // 可以使用其他库如 pdf2pic 或 pdf2image

      pagesData.push({
        pageNumber: i + 1,
        image: `/uploads/images/${book.id}/${imageName}`,
        content: '', // 这里可以添加 OCR 功能来提取文字
        isDeleted: false
      });
    }

    // 更新图书封面和页面
    const updatedBook = await prisma.book.update({
      where: { id: book.id },
      data: {
        coverImage: pagesData[0]?.image || '',
        pages: {
          create: pagesData
        }
      },
      include: {
        pages: true
      }
    });

    return NextResponse.json(updatedBook, { status: 201 });
  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json(
      { error: 'Failed to upload book' },
      { status: 500 }
    );
  }
}

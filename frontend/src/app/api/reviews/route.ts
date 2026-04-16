import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const reviewSchema = z.object({
  fullName: z.string().min(2, 'Tên phải từ 2 ký tự trở lên'),
  email: z.string().email('Email không hợp lệ'),
  roomType: z.string().min(1, 'Vui lòng chọn loại phòng'),
  checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày nhận phòng không hợp lệ'),
  checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày trả phòng không hợp lệ'),
  rating: z.number().int().min(1, 'Điểm đánh giá phải từ 1 tới 5').max(5, 'Điểm đánh giá phải từ 1 tới 5'),
  title: z.string().min(5, 'Tiêu đề phải từ 5 ký tự trở lên').max(200, 'Tiêu đề không quá 200 ký tự'),
  content: z.string().min(10, 'Nội dung phải từ 10 ký tự trở lên').max(5000, 'Nội dung không quá 5000 ký tự'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = reviewSchema.parse(body);

    // Validate check-out date is after check-in date
    const checkIn = new Date(validatedData.checkInDate);
    const checkOut = new Date(validatedData.checkOutDate);
    if (checkOut <= checkIn) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ngày trả phòng phải sau ngày nhận phòng',
        },
        { status: 400 }
      );
    }

    // TODO: In production, save to database or send to backend API
    // For now, just log and return success
    console.log('Review submission:', validatedData);

    // Simulate sending email (in production, integrate with email service)
    // await sendEmail({
    //   to: 'reviews@khachsannganha.com',
    //   subject: `Đánh giá mới từ ${validatedData.fullName}`,
    //   html: `...`
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Cảm ơn bạn đã chia sẻ đánh giá. Chúng tôi sẽ xem xét và phản hồi sớm nhất!',
        data: {
          id: `review_${Date.now()}`,
          ...validatedData,
          createdAt: new Date().toISOString(),
          verified: false,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Review form error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi server. Vui lòng thử lại sau.',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching reviews (optional)
export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    // For now, return mock data
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    return NextResponse.json(
      {
        success: true,
        message: 'Lấy danh sách đánh giá thành công',
        data: {
          reviews: [],
          total: 0,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi lấy danh sách đánh giá',
      },
      { status: 500 }
    );
  }
}

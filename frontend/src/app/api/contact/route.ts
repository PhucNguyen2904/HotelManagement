import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Tên phải từ 2 ký tự trở lên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  subject: z.enum(['booking', 'complaint', 'suggestion', 'other']),
  message: z.string().min(10, 'Nội dung phải từ 10 ký tự trở lên'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = contactFormSchema.parse(body);

    // TODO: In production, save to database or send email
    // For now, just log and return success
    console.log('Contact form submission:', validatedData);

    // Simulate sending email (in production, integrate with email service)
    // await sendEmail({
    //   to: 'nganhahotelquanlan@gmail.com',
    //   subject: `Liên hệ từ ${validatedData.fullName} - ${validatedData.subject}`,
    //   html: `<p>Từ: ${validatedData.fullName}</p>...`
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ trả lời sớm nhất.',
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi server. Vui lòng thử lại sau.',
      },
      { status: 500 }
    );
  }
}

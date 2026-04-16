'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Phone, Mail, MessageSquare } from 'lucide-react';

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Tên phải từ 2 ký tự trở lên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  subject: z.enum(['booking', 'complaint', 'suggestion', 'other'], {
    errorMap: () => ({ message: 'Vui lòng chọn chủ đề' }),
  }),
  message: z.string().min(10, 'Nội dung phải từ 10 ký tự trở lên'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitStatus({ type: null, message: '' });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ trả lời trong 2 giờ.',
        });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Gửi thất bại. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Lỗi kết nối. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <section className="bg-[var(--color-accent)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form Column */}
          <div>
            <h2 className="mb-2 text-3xl font-semibold text-[var(--color-primary)]">
              Gửi Thông Tin Cho Chúng Tôi
            </h2>
            <p className="mb-8 text-[var(--color-text)]/75">
              Điền biểu mẫu dưới đây, chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                {...register('fullName')}
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="0912 326 997"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  Chủ đề
                </label>
                <select
                  {...register('subject')}
                  className="block w-full rounded-md border-x-0 border-t-0 border-b border-[var(--color-secondary)] bg-[rgba(255,255,255,0.45)] px-3 py-2 text-[var(--color-primary)] focus:border-[var(--color-secondary)] focus:outline-none focus:ring-0"
                >
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="booking">Đặt phòng</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="suggestion">Góp ý</option>
                  <option value="other">Khác</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  Nội dung
                </label>
                <textarea
                  id="message"
                  placeholder="Hãy cho chúng tôi biết bạn cần gì..."
                  rows={5}
                  {...register('message')}
                  className="block w-full rounded-md border-x-0 border-t-0 border-b border-[var(--color-secondary)] bg-[rgba(255,255,255,0.45)] px-3 py-2 text-[var(--color-primary)] placeholder-[var(--color-text)]/55 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-0"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {submitStatus.type && (
                <div
                  className={`rounded-lg p-4 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
              </Button>
            </form>
          </div>

          {/* Quick Actions Column */}
          <div className="flex flex-col space-y-6 lg:justify-center">
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-[var(--color-primary)]">
                Hoặc liên hệ trực tiếp
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:0912326997"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]/15">
                    <Phone className="text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]/70">
                      Gọi ngay
                    </p>
                    <p className="text-lg font-bold text-[var(--color-primary)]">
                      0912 326 997
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:nganhahotelquanlan@gmail.com"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]/15">
                    <Mail className="text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]/70">
                      Gửi email
                    </p>
                    <p className="text-sm font-bold text-[var(--color-primary)] truncate">
                      nganhahotelquanlan@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://zalo.me/0912326997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]/15">
                    <MessageSquare className="text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]/70">
                      Nhắn tin Zalo
                    </p>
                    <p className="text-lg font-bold text-[var(--color-primary)]">
                      0912 326 997
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6">
              <p className="text-sm text-[var(--color-text)]/70">
                ⏱️ <span className="font-semibold">Thời gian trả lời:</span> Chúng tôi 
                trả lời tất cả tin nhắn trong vòng 2 giờ trong giờ làm việc (8:00-22:00).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

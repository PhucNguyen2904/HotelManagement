'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FormData {
  fullName: string;
  email: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  rating: number;
  title: string;
  content: string;
}

interface FormError {
  [key: string]: string;
}

const roomTypes = [
  'Phòng Deluxe Sea View',
  'Phòng Suite Premium',
  'Phòng Deluxe Standard',
  'Phòng Standard View Biển',
];

export function ReviewForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    rating: 5,
    title: '',
    content: '',
  });

  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Tên không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Vui lòng chọn loại phòng';
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Vui lòng chọn ngày nhận phòng';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Vui lòng chọn ngày trả phòng';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Ngày trả phòng phải sau ngày nhận phòng';
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung đánh giá không được để trống';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Nội dung phải từ 10 ký tự trở lên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          message: 'Cảm ơn bạn! Đánh giá của bạn đã được gửi thành công. 🎉',
        });
        setFormData({
          fullName: '',
          email: '',
          roomType: '',
          checkInDate: '',
          checkOutDate: '',
          rating: 5,
          title: '',
          content: '',
        });
        setErrors({});
      } else {
        setSubmitMessage({
          type: 'error',
          message: data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: 'Lỗi kết nối. Vui lòng thử lại sau.',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl editorial-shadow p-8">
      <h2 className="text-2xl md:text-3xl font-serif font-semibold text-manor-primary mb-2">
        Chia sẻ trải nghiệm của bạn
      </h2>
      <p className="text-slate-600 mb-8">
        Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ. Cảm ơn bạn đã tin tưởng!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success/Error Message */}
        {submitMessage && (
          <div
            className={`p-4 rounded-lg ${
              submitMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {submitMessage.message}
          </div>
        )}

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <Input
            label="Họ và tên *"
            type="text"
            placeholder="Nhập tên của bạn"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          {/* Email */}
          <Input
            label="Email *"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-manor-primary mb-2">
              Loại phòng *
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-manor-secondary ${
                errors.roomType ? 'border-red-500' : 'border-manor-surface-high'
              }`}
            >
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.roomType && <p className="text-red-600 text-sm mt-1">{errors.roomType}</p>}
          </div>

          {/* Check-in Date */}
          <Input
            label="Ngày nhận phòng *"
            type="date"
            value={formData.checkInDate}
            onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
            error={errors.checkInDate}
          />

          {/* Check-out Date */}
          <Input
            label="Ngày trả phòng *"
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
            error={errors.checkOutDate}
          />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-manor-primary mb-3">
              Đánh giá của bạn *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-4xl transition-transform duration-200 ${
                    star <= formData.rating
                      ? 'text-yellow-400 scale-110'
                      : 'text-gray-300 hover:scale-105'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <Input
          label="Tiêu đề đánh giá *"
          type="text"
          placeholder="Tóm tắt trải nghiệm của bạn..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-manor-primary mb-2">
            Nội dung đánh giá * (tối thiểu 10 ký tự)
          </label>
          <textarea
            placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-manor-secondary resize-none ${
              errors.content ? 'border-red-500' : 'border-manor-surface-high'
            }`}
          />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
          <p className="text-xs text-slate-500 mt-2">
            {formData.content.length} ký tự
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Gửi đánh giá
          </Button>
          <Button
            type="reset"
            variant="outline"
            size="lg"
            onClick={() => {
              setFormData({
                fullName: '',
                email: '',
                roomType: '',
                checkInDate: '',
                checkOutDate: '',
                rating: 5,
                title: '',
                content: '',
              });
              setErrors({});
              setSubmitMessage(null);
            }}
          >
            Xóa
          </Button>
        </div>
      </form>
    </div>
  );
}

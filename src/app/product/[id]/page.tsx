'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { addToCart, openCartDrawer, getProductReviews, addProductReview, ProductReview } from '@/lib/storage';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  Download, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Share2, 
  BookOpen, 
  Sparkles,
  Send,
  User
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const product = getProductById(id);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setReviews(getProductReviews(product.id));
    }
  }, [product]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    const added = addProductReview(product.id, reviewerName, reviewRating, reviewComment);
    setReviews((prev) => [added, ...prev]);
    setReviewComment('');
    setReviewerName('');
    setReviewRating(5);
    setIsSubmittingReview(false);
    showToast('ขอบคุณสำหรับรีวิว! บันทึกความคิดเห็นของคุณเรียบร้อยแล้ว');
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#102f31]">ไม่พบสินค้านี้ในระบบ</h2>
        <p className="text-[#66706b] text-sm">สินค้าอาจถูกย้ายหรือไม่มีอยู่ในระบบแล้ว</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าร้านค้า
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`เพิ่ม "${product.title}" ลงในตะกร้าแล้ว`);
    openCartDrawer();
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/checkout');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400/40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#66706b] hover:text-[#b44924] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับไปหน้าร้านค้า</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left column: Image & Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-gray-800 shadow-2xl aspect-[4/3] sm:aspect-square bg-gray-950">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-lg">
                  {product.badge}
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-gray-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-gray-300">
              <span>ขนาดไฟล์: <strong>{product.fileSize}</strong></span>
              <span>รูปแบบ: <strong>{product.fileFormat}</strong></span>
            </div>
          </div>

          {/* Author info */}
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-gray-800">
            <img
              src={product.author.avatar}
              alt={product.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
            />
            <div>
              <span className="text-xs text-indigo-400 font-medium">ผู้เขียน / ผู้สร้างสรรค์</span>
              <h4 className="text-sm font-bold text-white">{product.author.name}</h4>
              <p className="text-xs text-gray-400">{product.author.role}</p>
            </div>
          </div>
        </div>

        {/* Right column: Product Info & Actions */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-gray-400">({product.reviewsCount} รีวิว)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#102f31] tracking-tight leading-snug">
              {product.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#66706b] leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Price & Action Box */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-6 bg-gradient-to-br from-indigo-950/40 via-gray-900/60 to-gray-950">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-400 block mb-1">ราคาจำหน่าย (Digital Download)</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-500 line-through font-mono">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      ลดทันที {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ส่งมอบทันทีผ่านอีเมล & ลิงก์ดาวน์โหลด
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>สั่งซื้อทันที (Buy Now)</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm sm:text-base border border-gray-700 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span>เพิ่มลงในตะกร้า</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-gray-400">
              ⚡ ระบบชำระเงินจำลอง (DEMO ONLY) — เหมาะสำหรับการทดสอบและสาธิตโครงการ
            </p>
          </div>

          {/* Key Features list */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#102f31] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              จุดเด่นและสิ่งที่จะได้รับในชุดนี้
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, idx) => (
                <div key={idx} className="glass-panel p-3.5 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of contents if available */}
          {product.tableOfContents && product.tableOfContents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h3 className="text-base font-bold text-[#102f31] flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                สารบัญและเนื้อหาภายในเล่ม (Table of Contents)
              </h3>
              <div className="glass-panel rounded-2xl divide-y divide-gray-800/80 overflow-hidden text-xs sm:text-sm">
                {product.tableOfContents.map((chapter, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-gray-300 hover:bg-gray-800/40">
                    <span className="font-medium">{chapter}</span>
                    <span className="text-xs text-gray-500 font-mono">บทที่ {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample content excerpt */}
          {product.sampleContent && (
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <h3 className="text-base font-bold text-[#102f31] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                ตัวอย่างเนื้อหาทดลองอ่าน (Sample Excerpt)
              </h3>
              <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-xs sm:text-sm text-gray-400 italic leading-relaxed">
                "{product.sampleContent}"
              </div>
            </div>
          )}

          {/* Customer Reviews & Ratings Section */}
          <div className="space-y-5 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#102f31] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                รีวิวจากผู้อ่าน ({product.reviewsCount + reviews.length} รีวิว)
              </h3>
            </div>

            {/* Review form */}
            <form
              onSubmit={handleReviewSubmit}
              className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3 bg-gray-900/60"
            >
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                ร่วมแบ่งปันความคิดเห็น / รีวิวหนังสือเล่มนี้
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ชื่อของคุณ (เช่น สมชาย หรือ DevPro)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">ให้คะแนน:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                        title={`${star} ดาว`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  rows={2}
                  required
                  placeholder="เขียนความประทับใจ หรือข้อคิดเห็นเกี่ยวกับหนังสือเล่มนี้..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 self-end"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรีวิว</span>
                </button>
              </div>
            </form>

            {/* List of Reviews */}
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white flex items-center gap-1">
                        <User className="w-3 h-3 text-indigo-400" />
                        {rev.authorName}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {new Date(rev.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

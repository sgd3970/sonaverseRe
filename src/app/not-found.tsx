'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-bg-soft px-6 py-32">
      <div className="max-w-2xl w-full text-center space-y-8 md:space-y-12">
        {/* 404 숫자와 아이콘 */}
        <div className="relative inline-block">
          <div className="text-[120px] md:text-[200px] font-black text-primary/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 md:size-32 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-primary animate-bounce-slow">
              <span className="material-symbols-outlined select-none text-4xl md:text-6xl">
                search_off
              </span>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-base md:text-xl text-gray-500 font-light leading-relaxed max-w-lg mx-auto">
            요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
            <br className="hidden md:block" />
            입력하신 주소가 정확한지 다시 한번 확인해주세요.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <button className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined select-none">home</span>
              메인으로 돌아가기
            </button>
          </Link>
          <Link href="/inquiry">
            <button className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-full bg-white border-2 border-gray-100 text-gray-600 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined select-none">support_agent</span>
              고객지원 문의
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

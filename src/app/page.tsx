"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, Navigation, Share2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-uber-black)] font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Best Route</div>
          <Link
            href="/planner"
            className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            無料で試す
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            最短ルートを、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">1秒で。</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            「東京タワーと浅草寺、どっちを先に回るのが正解？」<br className="hidden md:block" />
            旅行の計画や毎日の外回りで、ルート作りに悩む時間はもう終わり。<br className="hidden md:block" />
            目的地を入れるだけで、最も効率の良い順番を自動で計算します。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link
              href="/planner"
              className="w-full sm:w-auto flex items-center justify-center bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 group"
            >
              今すぐ経路を計算する
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 font-medium">登録不要・完全無料</p>
          </motion.div>
        </div>

        {/* Hero Visual - Realistic App Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 w-full max-w-2xl lg:max-w-none relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl bg-white aspect-[4/3] flex flex-col">
             {/* Mockup Header (Browser style) */}
             <div className="h-12 border-b border-gray-100 bg-gray-50/80 backdrop-blur flex items-center px-4 gap-2 shrink-0">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
               <div className="flex-1 mx-4 bg-white border border-gray-200 rounded-md h-6 flex items-center px-2">
                 <span className="text-[10px] text-gray-400">best-route.vercel.app/planner</span>
               </div>
             </div>
             {/* Mockup Body: Clean White Map & Sidebar */}
             <div className="flex-1 flex relative">
                {/* Sidebar Mock */}
                <div className="w-1/3 bg-white border-r border-gray-100 p-4 hidden sm:flex flex-col gap-3 shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-10">
                  <div className="font-bold tracking-tight text-lg">Route Planner</div>
                  <div className="text-[10px] text-gray-400 -mt-2 mb-2">複数の訪問先を最も効率よく回る</div>
                  
                  <div className="space-y-2">
                    <div className="h-8 w-full bg-white border border-gray-200 rounded-md flex items-center px-2 gap-2">
                       <span className="text-[10px] text-gray-600">東京駅</span>
                    </div>
                    <div className="h-8 w-full bg-white border border-gray-200 rounded-md flex items-center px-2 gap-2">
                       <span className="text-[10px] text-gray-600">皇居</span>
                    </div>
                    <div className="h-8 w-full bg-white border border-gray-200 rounded-md flex items-center px-2 gap-2">
                       <span className="text-[10px] text-gray-600">東京タワー</span>
                    </div>
                    <div className="h-8 w-full bg-white border border-gray-200 rounded-md flex items-center px-2 gap-2">
                       <span className="text-[10px] text-gray-600">浅草寺</span>
                    </div>
                  </div>
                  <div className="mt-auto h-10 w-full bg-black rounded-full flex items-center justify-center text-white text-[11px] font-medium">最高効率のルートを検索</div>
                </div>
                {/* Map Interface Mock */}
                <div className="flex-1 relative overflow-hidden bg-[#f0f3f6]">
                   {/* Clean Map Elements */}
                   <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Roads grid (abstract) */}
                      <path d="M0 50 L500 50 M0 150 L500 150 M0 250 L500 250 M100 0 L100 300 M250 0 L250 300 M400 0 L400 300" stroke="#e5e7eb" strokeWidth="2" />
                      
                      {/* Route Path */}
                      <path d="M100 200 L150 150 L250 250 L350 100 L400 150" fill="none" stroke="#000000" strokeWidth="4" className="animate-[dash_20s_linear_infinite]" strokeLinecap="round" strokeDasharray="8 8" />
                      
                      {/* Markers */}
                      <circle cx="100" cy="200" r="5" fill="#000" />
                      <text x="110" y="200" fontSize="10" fontWeight="bold" fill="#000">東京駅</text>

                      <circle cx="150" cy="150" r="5" fill="#000" />
                      <text x="160" y="150" fontSize="10" fontWeight="bold" fill="#000">皇居</text>

                      <circle cx="250" cy="250" r="5" fill="#000" />
                      <text x="260" y="250" fontSize="10" fontWeight="bold" fill="#000">東京タワー</text>

                      <circle cx="350" cy="100" r="5" fill="#000" />
                      <text x="360" y="100" fontSize="10" fontWeight="bold" fill="#000">浅草寺</text>
                   </svg>
                   <style jsx>{`
                     @keyframes dash {
                       to { stroke-dashoffset: -1000; }
                     }
                   `}</style>
                   
                   {/* Floating Card */}
                   <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                         <span className="text-white font-bold text-[10px]">最適</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium">総所要時間</div>
                        <div className="font-bold text-sm text-black">1時間 45分</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Decorative blur */}
          <div className="absolute -z-10 inset-0 translate-y-8 scale-95 blur-2xl bg-gray-200/50 rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Outline */}
      <section className="bg-white py-24 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">旅のしおり作りを、もっと楽しく。</h2>
            <p className="text-gray-600 text-lg">無印良品のようにシンプルで、Google マップのように強力。誰もが迷わず使えるクリーンなUI設計。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical & Clean Appeal */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="flex-1 relative z-10">
               <h2 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight leading-tight">
                 驚くほどのスピード。<br />洗練された操作感。
               </h2>
               <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                 Vercelの高速なインフラを使用しているため、複雑な経路計算も一瞬で完了。不要な装飾や広告がない、クリーンで快適なルート作成体験をお約束します。
               </p>
               <Link
                  href="/planner"
                  className="inline-flex items-center text-black font-semibold hover:text-gray-600 transition-colors group"
                >
                  ルート作成アプリを開く
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="flex-1 w-full max-w-sm relative z-10">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-lg">
                   <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-500">システムパフォーマンス</span>
                      <span className="text-black font-semibold">Excellent</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-gray-900 font-medium text-sm">レスポンスタイム</span>
                         <span className="text-gray-500 font-mono text-xs">&lt; 100ms</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-black w-[95%] h-full rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-gray-900 font-medium text-sm">最適化アルゴリズム</span>
                         <span className="text-gray-500 font-mono text-xs">Active</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-gray-400 w-full h-full rounded-full"></div>
                      </div>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold relative flex items-center">
             <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
             Best Route
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} yamahei21python. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "世界水準の経路計算",
    description: "世界中の道路を知り尽くした「Google Maps Directions API」の力を借りて、最も効率の良い回り方を一瞬で弾き出します。"
  },
  {
    icon: Navigation,
    title: "直感的な並び替え",
    description: "「やっぱりここを先に寄りたい」そんな時も、リストの目的地をドラッグ＆ドロップで入れ替えるだけでルートが瞬時に再計算されます。"
  },
  {
    icon: Share2,
    title: "スマホへ即座に共有",
    description: "完成したルートはQRコードでスマートに共有。同行者のスマホで読み込めば、そのままGoogleマップでナビゲーションを開始できます。"
  }
];

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Navigation, Share2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isDemoActive, setIsDemoActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsDemoActive(prev => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
          
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg font-bold text-gray-900"
            >
              「東京タワーと浅草寺、どっちを先に回るのが正解？」
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              旅行の計画や毎日の外回りで、ルート作りに悩む時間はもう終わり。<br />
              目的地を入れるだけで、最も効率の良い順番を自動で計算します。
            </motion.p>
          </div>
          
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

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 w-full max-w-2xl lg:max-w-none relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl bg-white aspect-[4/3] flex flex-col">
             {/* Mockup Header */}
             <div className="h-10 border-b border-gray-100 bg-gray-50 flex items-center px-4 gap-2 shrink-0">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
               <div className="flex-1 mx-4 bg-white border border-gray-200 rounded h-5 flex items-center px-2">
                 <span className="text-[8px] text-gray-400">best-route.vercel.app/planner</span>
               </div>
             </div>
             
             {/* Mockup Body */}
             <div className="flex-1 flex relative">
                {/* Sidebar Mock */}
                <div className="w-1/3 bg-white border-r border-gray-100 p-4 hidden sm:flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-10 relative">
                  <div className="font-bold tracking-tight text-lg mb-0.5">Best Route</div>
                  <div className="text-[9px] text-gray-400 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">複数の訪問先を最も効率よく回る</div>
                  
                  <div className="space-y-1.5 mb-4 max-h-[160px] overflow-hidden">
                    {["東京駅", "皇居", "東京タワー", "浅草寺"].map((point, i) => (
                      <div key={i} className="h-7 w-full border border-gray-200 bg-white rounded-md flex items-center px-2 shrink-0">
                         <div className="w-1 h-1 rounded-full bg-gray-300 mr-2"></div>
                         <span className="text-[10px] text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto h-9 w-full bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                    最高効率のルートを検索
                  </div>
                </div>

                {/* Map Mock */}
                <div className="flex-1 relative overflow-hidden bg-[#f4f7f9]">
                   <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                      <path d="M0 50 L400 50 M0 150 L400 150 M0 250 L400 250 M130 0 L130 300 M260 0 L260 300" stroke="#eef2f5" strokeWidth="1" />
                      <motion.path 
                        d={isDemoActive ? "M130 150 L100 80 L180 50 L200 200" : "M130 150 L180 50 L100 80 L200 200"}
                        fill="none" 
                        stroke={isDemoActive ? "#10b981" : "#e5e7eb"} 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        className="transition-all duration-1000"
                      />
                      <circle cx="130" cy="150" r="4" fill="#000" />
                      <text x="140" y="154" className="text-[10px] font-bold" fill="#000">東京駅</text>
                      <circle cx="100" cy="80" r="4" fill="#666" />
                      <text x="110" y="84" className="text-[9px]" fill="#666">皇居</text>
                      <circle cx="180" cy="50" r="4" fill="#666" />
                      <text x="190" y="54" className="text-[9px]" fill="#666">東京タワー</text>
                      <circle cx="200" cy="200" r="4" fill="#666" />
                      <text x="210" y="204" className="text-[9px]" fill="#666">浅草寺</text>
                   </svg>
                   
                   <div className="absolute top-4 right-4 bg-white p-2.5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                         <span className="text-white font-bold text-[9px]">最適</span>
                      </div>
                      <div>
                        <div className="text-[8px] text-gray-500 font-bold uppercase">総所要時間</div>
                        <div className="font-bold text-[11px] text-black">1時間 45分</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div className="absolute -z-10 inset-0 translate-y-8 scale-95 blur-2xl bg-gray-200/50 rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Outline */}
      <section className="bg-white py-24 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">旅のしおり作りを、もっと楽しく。</h2>
            <p className="text-gray-600 text-lg leading-relaxed">無印良品のようにシンプルで、Google マップのように強力。<br />誰もが迷わず使えるクリーンなUI設計。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">世界水準の経路計算</h3>
              <p className="text-gray-600 text-sm leading-relaxed">世界中の道路を知り尽くした「Google Maps Directions API」の力を借りて、最も効率の良い回り方を一瞬で弾き出します。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Navigation className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">直感的な並び替え</h3>
              <p className="text-gray-600 text-sm leading-relaxed">「やっぱりここを先に寄りたい」そんな時も、リストの目的地をドラッグ＆ドロップで入れ替えるだけでルートが瞬時に再計算されます。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Share2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">スマホへ即座に共有</h3>
              <p className="text-gray-600 text-sm leading-relaxed">完成したルートはQRコードでスマートに共有。同行者のスマホで読み込めば、そのままGoogleマップでナビゲーションを開始できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
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
                  className="inline-flex items-center text-black font-bold hover:gap-2 transition-all group"
                >
                  Best Routeを開く
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1" />
                </Link>
            </div>
            
            <div className="flex-1 w-full max-w-sm relative z-10">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-xl">
                   <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-500 font-bold text-[10px] uppercase">Performance</span>
                      <span className="text-black font-bold">Excellent</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-gray-700 text-sm">レスポンスタイム</span>
                         <span className="text-gray-400 font-mono text-xs">&lt; 100ms</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full">
                         <div className="bg-black w-[95%] h-full rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-gray-700 text-sm">最適化アルゴリズム</span>
                         <span className="text-gray-400 font-mono text-xs">Active</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full">
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
          <div className="font-extrabold text-xl tracking-tight">Best Route</div>
          <div className="text-sm text-gray-500">
            © 2026 yamahei21python. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, MousePointerClick, Share2 } from "lucide-react";
import Image from "next/image";

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
            訪問先が多すぎて、どの順番で回ればいいか迷っていませんか？<br className="hidden md:block" />
            旅行、営業、配送の計画を、直感的かつプロフェッショナルなUIで最適化します。
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

        {/* Hero Visual - Abstract Representation or Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 w-full max-w-2xl lg:max-w-none relative"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl bg-gray-50 aspect-[4/3] flex flex-col">
             {/* Mockup Header */}
             <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-2 shrink-0">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
               <div className="flex-1 mx-4 bg-gray-100 rounded-md h-6"></div>
             </div>
             {/* Mockup Body: Map & Sidebar abstract */}
             <div className="flex-1 flex relative bg-[#E1E6EB]">
                {/* Sidebar Mock */}
                <div className="w-1/3 bg-white border-r border-gray-200 p-4 hidden sm:flex flex-col gap-3">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center px-3 gap-2">
                       <MapPin className="w-4 h-4 text-blue-500" />
                       <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 border-l-2 border-dashed border-gray-300 ml-4"></div>
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center px-3 gap-2">
                       <MapPin className="w-4 h-4 text-red-500" />
                       <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-auto h-12 w-full bg-black rounded-full mb-2"></div>
                </div>
                {/* Map Interface Mock */}
                <div className="flex-1 relative overflow-hidden">
                   {/* Abstract Map Elements */}
                   <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 100 Q 150 50 250 150 T 400 100" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                      <circle cx="50" cy="100" r="6" fill="#3B82F6" />
                      <circle cx="250" cy="150" r="6" fill="#10B981" />
                      <circle cx="400" cy="100" r="8" fill="#EF4444" />
                   </svg>
                   <style jsx>{`
                     @keyframes dash {
                       to { stroke-dashoffset: -1000; }
                     }
                   `}</style>
                   
                   {/* Floating Card */}
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 w-48">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                         <span className="text-green-600 font-bold text-sm">最適</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium">計算結果</div>
                        <div className="font-bold text-sm">24.5 km / 45分</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Decorative blur */}
          <div className="absolute -z-10 inset-0 translate-y-8 scale-95 blur-2xl bg-gradient-to-tr from-gray-200 to-gray-100 opacity-50 rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Outline */}
      <section className="bg-gray-50 py-24 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">複雑な計算は、すべて裏側で。</h2>
            <p className="text-gray-600 text-lg">プロ仕様の最適化アルゴリズムを、誰もが迷わず使えるクリーンなUIに乗せました。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="bg-black text-white rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gray-800/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex-1 relative z-10">
               <h2 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight leading-tight">
                 驚くほどのスピード。<br />洗練された操作感。
               </h2>
               <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                 Vercelネイティブなサーバーレス・アーキテクチャによる高速なレスポンス。そして、不必要な要素を削ぎ落としたミニマルなUI設計。<br className="hidden md:block"/>快適なルート作成体験をお約束します。
               </p>
               <Link
                  href="/planner"
                  className="inline-flex items-center text-white font-medium hover:text-gray-300 transition-colors group"
                >
                  ルート作成アプリを開く
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="flex-1 w-full max-w-sm relative z-10">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl space-y-4 shadow-2xl">
                   <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                      <span className="text-gray-400">システムパフォーマンス</span>
                      <span className="text-green-400 font-medium">Excellent</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-white font-medium">レスポンスタイム</span>
                         <span className="text-gray-300 font-mono text-sm">&lt; 100ms</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-green-400 w-[95%] h-full rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-white font-medium">最適化アルゴリズム</span>
                         <span className="text-gray-300 font-mono text-sm">Active</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-blue-400 w-full h-full rounded-full"></div>
                      </div>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tight">Best Route</div>
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
    description: "Google Maps Directions APIを活用し、膨大なパターンから最も効率的なルートを瞬時に導き出します。"
  },
  {
    icon: MousePointerClick,
    title: "直感的な並び替え",
    description: "「やっぱりここを先に寄りたい」そんな時も、ドラッグ＆ドロップで簡単にルートの微調整が可能です。"
  },
  {
    icon: Share2,
    title: "スマホへ即座に共有",
    description: "決定したルートはQRコードでスマートに共有。そのままスマホのGoogleマップでナビゲーションを開始できます。"
  }
];

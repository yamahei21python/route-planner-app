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
            href="/"
            className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            アプリを開く
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
            Best Routeを、<br />
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
              href="/"
              className="w-full sm:w-auto flex items-center justify-center bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 group"
            >
              アプリを開く
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
                <span className="text-[8px] text-gray-400">best-route.vercel.app/</span>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex-1 flex relative">
              {/* Sidebar Mock */}
              <div className="w-1/3 bg-white border-r border-gray-100 p-4 hidden sm:flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-10 relative">
                <div className="font-bold tracking-tight text-xl mb-6">Best Route</div>

                <div className="space-y-1.5 mb-4 max-h-[160px] overflow-hidden">
                  {["東京駅", "皇居", "東京タワー", "浅草寺"].map((point, i) => (
                    <div key={i} className="h-7 w-full border border-gray-200 bg-white rounded-md flex items-center px-2 shrink-0">
                      <div className="w-1 h-1 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-[10px] text-gray-600">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto h-9 w-full bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                  ルート最適化
                </div>
              </div>

              {/* Map Mock */}
              <div className="flex-1 relative overflow-hidden bg-[#f8fafc]">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.4]" 
                     style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  {/* Grid Lines */}
                  <path d="M0 75 L400 75 M0 150 L400 150 M0 225 L400 225 M100 0 L100 300 M200 0 L200 300 M300 0 L300 300" 
                        stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Route Line */}
                  <motion.path
                    d={isDemoActive 
                        ? "M 200 180 L 120 120 L 160 240 L 320 80" // Optimized: Tokyo -> Palace -> Tower -> Sensoji
                        : "M 200 180 L 320 80 L 120 120 L 160 240"  // Scattered: Tokyo -> Sensoji -> Palace -> Tower
                    }
                    fill="none"
                    stroke={isDemoActive ? "#10b981" : "#cbd5e1"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ 
                      d: isDemoActive 
                        ? "M 200 180 L 120 120 L 160 240 L 320 80" 
                        : "M 200 180 L 320 80 L 120 120 L 160 240" 
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />

                  {/* Nodes */}
                  {[
                    { x: 200, y: 180, label: "東京駅", bold: true },
                    { x: 120, y: 120, label: "皇居" },
                    { x: 160, y: 240, label: "東京タワー" },
                    { x: 320, y: 80, label: "浅草寺" }
                  ].map((node, i) => (
                    <g key={i}>
                      <motion.circle 
                        cx={node.x} cy={node.y} r="5" 
                        fill={i === 0 ? "#000" : "#64748b"} 
                        animate={{ scale: isDemoActive ? 1.2 : 1 }}
                      />
                      <text x={node.x + 12} y={node.y + 4} 
                            className={`text-[11px] ${node.bold ? 'font-bold' : 'font-medium'}`} 
                            fill={node.bold ? "#000" : "#64748b"}>
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Status Badge */}
                <motion.div 
                  className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20"
                  animate={{ y: isDemoActive ? 0 : 4, opacity: isDemoActive ? 1 : 0.9 }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isDemoActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {isDemoActive ? (
                      <span className="font-bold text-[10px]">最適</span>
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">総所要時間</div>
                    <div className={`font-bold text-[13px] transition-colors duration-500 ${isDemoActive ? 'text-black' : 'text-gray-300'}`}>
                      {isDemoActive ? "1時間 45分" : "--時間 --分"}
                    </div>
                  </div>
                </motion.div>
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">移動のムダを、ゼロにする。</h2>
            <p className="text-gray-600 text-lg leading-relaxed">無印良品のようにシンプルで、Google マップのように強力。<br />誰もが迷わず使えるクリーンなUI設計。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">世界中の道路を網羅</h3>
              <p className="text-gray-600 text-sm leading-relaxed">膨大な道路データをもとに、最も効率の良い回り方を一瞬で。複雑な計算はすべてアプリに任せて、あなたは目的地を選ぶだけです。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Navigation className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">自由自在な入れ替え</h3>
              <p className="text-gray-600 text-sm leading-relaxed">「やっぱりここを先に寄りたい」そんな時も、行きたい場所を好きな順番に入れ替えるだけ。ルートは瞬時に、最適な形で更新されます。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <Share2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">スマホに送って出発</h3>
              <p className="text-gray-600 text-sm leading-relaxed">完成したルートはスマホに送るだけ。そのまま地図アプリを起動して、迷うことなく目的地までスムーズに移動できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-12 md:p-20 flex flex-col items-center text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight text-gray-900">
            驚くほどのスピード。<br className="sm:hidden" />洗練された操作感。
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            どんなに複雑なルートも、一瞬で作成。<br className="hidden sm:block" />
            無駄な広告や装飾をすべて削ぎ落とし、ただ純粋に「移動を最適化する」ための快適な操作体験をお約束します。
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm group"
          >
            アプリを開く
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tight">Best Route</div>
          <div className="text-sm text-gray-400 font-medium tracking-tight">
            © 2026 yamahei21python. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

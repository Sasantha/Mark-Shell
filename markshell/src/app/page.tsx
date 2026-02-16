'use client';

import { useEffect, useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Globe, Camera } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 40,
    hours: 8,
    minutes: 45,
    seconds: 22,
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden font-sans text-white bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://th.bing.com/th/id/OIP.5ietT7Ydf3wfQy6nw5GSOAHaEJ?w=312&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
          alt="Forest Background"
          fill
          className="object-cover opacity-80 scale-105"
          priority
          sizes="100vw"
          unoptimized
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Glass Card */}
      <div className="relative z-20 w-full max-w-xl mx-auto bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-2xl p-6 md:p-12 text-center flex flex-col items-center mt-4">

        {/* Logo Area */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(46,204,113,0.4)]">
            {/* Leaf Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black fill-black/90"><path d="M12.0001 21C12.0001 21 12.0001 11 12.0001 3C12.0001 3 16.5 5.5 19 9C21.5 12.5 21 18 21 18C21 18 16 17 12.0001 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21C12 21 12 11 12 3C12 3 7.5 5.5 5 9C2.5 12.5 3 18 3 18C3 18 8 17 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="text-[#2ecc71] text-[10px] font-bold tracking-[0.3em] uppercase">Markshell Pvt Ltd</h2>
        </div>

        {/* Hero Text */}
        <div className="mb-6 space-y-1">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-white">
            Sustainable <br />
            Elegance <br />
            <span className="text-white/80 font-semibold">is Coming</span>
          </h1>
        </div>

        <p className="text-gray-300 max-w-xs mx-auto mb-8 text-[11px] md:text-xs leading-relaxed tracking-wide font-light">
          Redefining eco-friendly corporate solutions. We are preparing to launch our exclusive B2B portal.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 mb-8 w-full max-w-sm px-2">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center bg-black/30 rounded-xl py-2.5 border border-white/5 backdrop-blur-sm">
              <span className="text-xl font-bold text-[#2ecc71] font-mono leading-none mb-1">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[7px] text-gray-400 uppercase tracking-widest font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Email Capture */}
        {/* <div className="w-full max-w-sm relative mb-6">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            placeholder="Enter your corporate email..."
            className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-32 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/50 transition-all"
          />
          <button className="absolute right-1 top-1 bottom-1 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-[10px] px-4 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-green-900/20">
            Notify Me <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div> */}

        {/* Footer Link */}
        {/* <div className="flex items-center space-x-1 mb-2">
          <a href="#" className="flex items-center text-gray-400 hover:text-white text-[9px] transition-colors gap-1.5 uppercase tracking-wide">
            Visit NUBIA Retail
            <div className="border border-white/30 rounded-[2px] p-[1px]">
              <ArrowRight className="w-2 h-2 -rotate-45" />
            </div>
          </a>
        </div> */}
      </div>

      {/* Page Footer */}
      <footer className="relative z-20 w-full max-w-4xl px-6 mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-medium pb-4">
        <p className="opacity-70 mb-4 md:mb-0">© 2024 Markshell Pvt Ltd. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            <div className="group cursor-pointer"><div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5"><CheckCircle2 className="w-3 h-3 text-white/80" /></div></div>
            <div className="group cursor-pointer"><div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5"><Globe className="w-3 h-3 text-white/80" /></div></div>
            <div className="group cursor-pointer"><div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5"><Camera className="w-3 h-3 text-white/80" /></div></div>
          </div>
          {/* <button className="bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] px-4 py-1.5 rounded-full flex items-center space-x-2 backdrop-blur-sm border border-[#2ecc71]/20 transition-all">
            <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full animate-pulse shadow-[0_0_5px_#2ecc71]"></span>
            <span className="font-bold tracking-wide">Whatsapp</span>
          </button> */}
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useState } from "react";
import { MessageSquare, CalendarDays, BookOpenCheck, HelpCircle, ShieldCheck, Users, MapPin, Landmark } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import ElectionTimeline from "@/components/ElectionTimeline";
import VoterGuide from "@/components/VoterGuide";
import FAQ from "@/components/FAQ";

type Tab = "chat" | "timeline" | "guide" | "faq";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "Assistant", icon: <MessageSquare size={18} /> },
  { id: "timeline", label: "Timeline", icon: <CalendarDays size={18} /> },
  { id: "guide", label: "Voter Guide", icon: <BookOpenCheck size={18} /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle size={18} /> },
];

const STATS = [
  { label: "Registered Voters", value: "96.8 Cr+", icon: <Users size={20} /> },
  { label: "Polling Stations", value: "10.5 Lakh+", icon: <MapPin size={20} /> },
  { label: "Election Phases", value: "7 Steps", icon: <CalendarDays size={20} /> },
  { label: "Voter ID Types", value: "12 IDs", icon: <ShieldCheck size={20} /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-group">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--text-main)' }}>
              <path d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="brand-name">ElectSmart</span>
            <span className="badge-pro">Civic</span>
          </div>
          <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="button-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            ECI Portal
          </a>
        </div>
      </header>

      <section className="hero-section container" style={{ position: 'relative' }}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="animate-fade-in" style={{ animationDelay: "0.1s", position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Powered by Google Gemini
            </div>
          </div>
          <h1 className="hero-title">
            <span className="hero-outline">Democracy,</span> <br />
            <span className="hero-solid">Demystified.</span>
          </h1>
          <p className="hero-subtitle">
            A premium, AI-powered guide to understanding the election process, your rights, and how to cast your vote confidently.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="button-primary" onClick={() => {
              setActiveTab("chat");
              document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ask the Assistant <MessageSquare size={16} />
            </button>
            <button className="button-outline" onClick={() => {
              setActiveTab("timeline");
              document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Timeline
            </button>
          </div>
        </div>

        <div className="hero-stats animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {STATS.map((stat, i) => (
            <div key={i} className="stat-pill">
              {stat.icon}
              <span><strong>{stat.value}</strong> {stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="main-content" className="nav-section container animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <nav className="nav-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </section>

      <section className="container animate-fade-in" style={{ paddingBottom: '100px', animationDelay: "0.4s" }}>
        {activeTab === "chat" && <ChatInterface />}
        {activeTab === "timeline" && <ElectionTimeline />}
        {activeTab === "guide" && <VoterGuide />}
        {activeTab === "faq" && <FAQ />}
      </section>
    </main>
  );
}

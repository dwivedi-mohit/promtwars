"use client";

import { useState } from "react";
import { Search, UserPlus, FileDown, MapPin, Scale, CheckSquare } from "lucide-react";

const STEPS = [
  { icon: <Search size={24}/>, title: "Check Roll", content: "Verify your name is on the Electoral Roll at voters.eci.gov.in." },
  { icon: <UserPlus size={24}/>, title: "Register", content: "If not registered, fill Form 6. You need proof of age & residence." },
  { icon: <FileDown size={24}/>, title: "e-EPIC", content: "Download your Electronic Electoral Photo Identity Card (e-EPIC)." },
  { icon: <MapPin size={24}/>, title: "Find Booth", content: "Locate your assigned polling station via the Voter Helpline App." },
  { icon: <Scale size={24}/>, title: "Rules", content: "Carry valid ID. Follow queue discipline. No phones inside." },
  { icon: <CheckSquare size={24}/>, title: "Vote", content: "Press the EVM button. A beep confirms. Verify the VVPAT slip." },
];

export default function VoterGuide() {
  const [active, setActive] = useState(0);

  return (
    <div className="wizard-layout">
      <div className="wizard-nav">
        {STEPS.map((step, i) => (
          <button key={i} className={`wizard-step-btn ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
            <div className="step-dot"/>
            <span style={{ fontWeight: 500 }}>{i+1}. {step.title}</span>
          </button>
        ))}
      </div>
      <div className="bento-card wizard-content">
        <div className="icon-wrapper" style={{ width: 64, height: 64, marginBottom: 24 }}>
          {STEPS[active].icon}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>STEP 0{active+1}</div>
        <h2 className="wiz-title">{STEPS[active].title}</h2>
        <p className="wiz-desc">{STEPS[active].content}</p>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
          <button className="button-outline" onClick={() => setActive(p => Math.max(0, p-1))} disabled={active===0}>Back</button>
          <button className="button-primary" onClick={() => setActive(p => Math.min(STEPS.length-1, p+1))} disabled={active===STEPS.length-1}>Continue</button>
        </div>
      </div>
    </div>
  );
}

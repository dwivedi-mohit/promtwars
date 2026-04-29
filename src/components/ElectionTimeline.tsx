"use client";

import { Megaphone, FileText, Landmark, Mic2, Inbox, BarChart2, Flag } from "lucide-react";

const TIMELINE = [
  { id: 1, icon: <Megaphone/>, title: "Announcement", desc: "ECI sets dates, Model Code of Conduct enforced.", details: ["Government cannot announce new schemes", "Nomination begins"] },
  { id: 2, icon: <FileText/>, title: "Voter Registration", desc: "Citizens verify EPIC and roll names.", details: ["Check voters.eci.gov.in", "File Form 6/8 if needed"] },
  { id: 3, icon: <Landmark/>, title: "Nominations", desc: "Candidates file papers.", details: ["Scrutiny by Returning Officer", "Symbols allotted"] },
  { id: 4, icon: <Mic2/>, title: "Campaigning", desc: "Rallies and door-to-door.", details: ["Strict finance limits", "Silence period 48h before poll"] },
  { id: 5, icon: <Inbox/>, title: "Voting Day", desc: "Citizens vote using EVMs.", details: ["7 AM to 6 PM standard", "VVPAT slip verification"] },
  { id: 6, icon: <BarChart2/>, title: "Vote Counting", desc: "Supervised counting.", details: ["Postal ballots first", "EVMs tallied with VVPAT"] },
  { id: 7, icon: <Flag/>, title: "Government Formation", desc: "Winners declared.", details: ["ECI certifies results", "Swearing-in ceremony"] },
];

export default function ElectionTimeline() {
  return (
    <div className="timeline-grid">
      {TIMELINE.map((step, i) => (
        <div key={step.id} className="bento-card timeline-card">
          <div className="tl-header">
            <div className="icon-wrapper">{step.icon}</div>
            <div>
              <div className="tl-num">0{step.id}</div>
              <h3 className="tl-title">{step.title}</h3>
            </div>
          </div>
          <p className="tl-desc">{step.desc}</p>
          <div className="tl-details">
            {step.details.map((d, idx) => (
              <span key={idx} className="tl-detail-item">• {d}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

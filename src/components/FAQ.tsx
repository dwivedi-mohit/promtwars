"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  { q: "What is the minimum age to vote in India?", a: "You must be at least **18 years old** as of January 1st of the qualifying year, and a citizen of India." },
  { q: "Is the EVM secure?", a: "Yes. An **Electronic Voting Machine (EVM)** is a standalone electronic device, not connected to any network, making remote hacking impossible." },
  { q: "What is VVPAT?", a: "**Voter Verified Paper Audit Trail (VVPAT)** prints a slip displaying your chosen candidate for 7 seconds behind a glass window, ensuring your vote was recorded correctly." },
  { q: "What IDs are accepted if I lost my Voter ID?", a: "The ECI accepts **12 alternative photo IDs** (Aadhaar, PAN, Passport, Driving License, etc.) as long as your name is on the Electoral Roll." },
  { q: "What is NOTA?", a: "**None of the Above (NOTA)** allows voters to register disapproval of all candidates. However, the candidate with the highest valid votes still wins." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const formatBold = (text: string) => text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return (
    <div className="faq-wrap">
      {FAQS.map((faq, i) => (
        <div key={i} className="faq-box" onClick={() => setOpen(open === i ? null : i)}>
          <div className="faq-q">
            {faq.q}
            {open === i ? <ChevronUp size={18} color="var(--text-muted)"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
          </div>
          {open === i && (
            <div className="faq-a" dangerouslySetInnerHTML={{ __html: formatBold(faq.a) }} />
          )}
        </div>
      ))}
    </div>
  );
}

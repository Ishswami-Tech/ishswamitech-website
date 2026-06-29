"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "917218378311";
  const message = "Hi! I'm interested in your software development services.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-40 rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#20BD5A] hover:shadow-[0_16px_36px_rgba(37,211,102,0.28)]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}

"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "911234567890";
  const message = "Hi! I'm interested in your software development services.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 p-3 rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg hover:scale-110 transition-all z-40"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}

"use client";

import { Twitter, Linkedin, Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-[#8B9CB6] text-sm">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#111827] text-[#8B9CB6] hover:text-[#00D4FF] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#111827] text-[#8B9CB6] hover:text-[#00D4FF] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <button
        onClick={copyLink}
        className="p-2 rounded-lg bg-[#111827] text-[#8B9CB6] hover:text-[#00D4FF] transition-colors"
        aria-label="Copy link"
      >
        <Link2 size={20} />
      </button>
    </div>
  );
}

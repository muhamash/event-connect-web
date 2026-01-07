"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({ title }: { title?: string }) {
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Check out this event",
          url,
        });
      } else if (navigator.clipboard) {
        // Desktop fallback
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        prompt("Copy this link:", url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="bg-yellow-800 backdrop-blur-sm hover:bg-background"
      onClick={handleShare}
    >
      <Share2 className="h-5 w-5 text-orange-100" />
    </Button>
  );
}
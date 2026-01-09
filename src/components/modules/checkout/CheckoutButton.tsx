
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutButton({ eventId }: { eventId: string }) {
  const [ loading, setLoading ] = useState( false );
  const router = useRouter();
  const [ goUrl, setGoUrl ] = useState();

  async function handleCheckout() {
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    const data = await res.json();
    console.log( data, eventId )
    
    window.location.href = data.url;
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? "Redirecting..." : "Proceed to Payment"}
    </Button>
  );
}

"use client";

import { mockEvents } from "@/components/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckoutFormValues } from "@/lib/services/checkout/cehckout.type";
import { checkoutSchema } from "@/lib/services/checkout/checkout.validation";
import { formatDate, formatTo12Hour } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import
  {
    ArrowLeft,
    Calendar,
    Check,
    CreditCard,
    MapPin,
    Shield,
    Users
  } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CheckoutProps
{
  sessionUser?: any;
  eventPromise: Promise<any>;
}

const Checkout = ({sessionUser, eventPromise}: CheckoutProps) => {
  const router = useRouter();
  const eventData = use( eventPromise );
  console.log(sessionUser, eventData?.data)

  const { id } = useParams();
  const searchParams = useSearchParams();
  const tickets = parseInt(searchParams.get("tickets") || "1");

  const event = mockEvents.find((e) => e.id === Number(id)) || mockEvents[0];

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      number: "",
      name: "",
      expiry: "",
      cvc: "",
    },
  });

  const subtotal = eventData?.data?.joiningFee;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(" ").slice(0, 19) : "";
  };

  const onSubmit = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 2000));
    setIsProcessing(false);
    setPaymentSuccess(true);
    toast.success("Payment successful! You're all set.");
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container max-w-lg mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Your tickets for {event.title} have been confirmed.
                </p>
                <Button className="w-full mb-3" onClick={() => router.push(`/events/${event.id}`)}>
                  View Event Details
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PAYMENT FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            onChange={(e) =>
                              field.onChange(formatCardNumber(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/YY" maxLength={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" maxLength={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                256-bit encrypted secure payment
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </Form>

          {/* ORDER SUMMARY (unchanged) */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <img src={eventData?.data?.image} className="h-24 w-32 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold">{eventData?.data?.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {formatDate(eventData?.data?.date, {withTime: false})} at {formatTo12Hour(eventData?.data?.time)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {eventData?.data?.location}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Tickets</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.maxAttendees - event.attendees} spots remaining
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
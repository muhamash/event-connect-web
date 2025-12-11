import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Calendar,
  MapPin,
  Users,
  Check,
  Shield,
} from "lucide-react";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tickets = parseInt(searchParams.get("tickets") || "1");

  const event = mockEvents.find((e) => e.id === Number(id)) || mockEvents[0];
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const subtotal = event.price * tickets;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentSuccess(true);
    toast.success("Payment successful! You're all set.");
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="bg-card border-border">
                <CardContent className="p-12">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Your tickets for {event.title} have been confirmed.
                  </p>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-primary"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Event Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-border"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div>
                <h1 className="text-3xl font-bold mb-6">
                  Complete Your{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Purchase
                  </span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardDetails.number}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              number: formatCardNumber(e.target.value),
                            }))
                          }
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="bg-background border-border"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={cardDetails.name}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="John Doe"
                          className="bg-background border-border"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                expiry: e.target.value,
                              }))
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                            className="bg-background border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            value={cardDetails.cvc}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                cvc: e.target.value,
                              }))
                            }
                            placeholder="123"
                            maxLength={4}
                            type="password"
                            className="bg-background border-border"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Your payment is secured with 256-bit encryption</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 h-12 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Pay ${total.toFixed(2)}
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-24 w-32 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold text-foreground">
                          {event.title}
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1 mt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Tickets ({tickets}x ${event.price})
                        </span>
                        <span className="text-foreground">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Service Fee (5%)
                        </span>
                        <span className="text-foreground">
                          ${serviceFee.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {event.maxAttendees - event.attendees} spots remaining
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;

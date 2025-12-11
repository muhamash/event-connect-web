import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Camera, X, Save, ArrowLeft } from "lucide-react";
import { mockUsers, interestOptions } from "@/data/mockData";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = mockUsers[0]; // Mock: current user

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location,
    interests: user.interests,
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
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

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-primary/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="City, State"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself..."
                      className="bg-background border-border min-h-[120px]"
                    />
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>Interests</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your interests to find relevant events
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            formData.interests.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer transition-all ${
                            formData.interests.includes(interest)
                              ? "bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                          {formData.interests.includes(interest) && (
                            <X className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;

"use client"

import RegisterForm from "@/components/modules/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background">

      <div className="pt-24 pb-12 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-gradient-primary rounded-2xl mb-4">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Join EventConnect</h1>
            <p className="text-muted-foreground">Create your account and start connecting</p>
          </div>

          <Card className="bg-card border-border shadow-md">
            <CardHeader className="text-center">
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RegisterForm/>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
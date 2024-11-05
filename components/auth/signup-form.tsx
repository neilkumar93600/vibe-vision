"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"; // Corrected import
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "../ui/input2";
import { Label } from "../ui/label2";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icons } from "../ui/icons";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@/config";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  channelName: z.string().min(3, "Channel name must be at least 3 characters"),
});

export function SignUpForm() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      channelName: "",
    },
  });


  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    const url = `${BASE_URL}/auth/signup`;
    try {
      await axios.post(url, {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        // channelName: data.channelName,
      });
      
      toast.success("Account created successfully! Please check your email to verify your account.");
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Join VibeVision
        </CardTitle>
        <CardDescription className="text-center">
          Create your account and start creating amazing content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...form.register("firstName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...form.register("lastName")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelName">Channel name</Label>
            <Input
              id="channelName"
              placeholder="Your unique channel name"
              {...form.register("channelName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" disabled={isLoading}>
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" disabled={isLoading}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
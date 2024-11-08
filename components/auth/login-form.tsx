"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Corrected import
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [localStorageInstance,  setLocalStorageInstance] = useState<Storage | null>(null)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    const url = `${BASE_URL}/auth/login`;
    try {
      const response = await axios.post(url, data);
      const { jwtToken, name, email } = response.data;

      // Save data to localStorage
      localStorageInstance?.setItem('token', jwtToken);
      localStorageInstance?.setItem('loggedInUser', name);
      localStorageInstance?.setItem('loggedInUserEmail', email);

      toast.success("Logged in successfully!");
      // Redirect to the gallery page (adjust URL if needed)
      window.location.href = "/entertainment-hub";
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // localStorageInstance = localStorage
    setLocalStorageInstance(localStorage)
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Login to your VibeVision account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
            Login
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
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
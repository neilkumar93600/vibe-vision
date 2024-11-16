"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input2";
import { Label } from "../ui/label2";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from 'next-auth/react';
import { GoogleLogin } from '@react-oauth/google';
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
import MessageToast from "../ui/MessageToast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [localStorageInstance, setLocalStorageInstance] = useState<Storage | null>(null)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('No Message');
  // const { data: session } = useSession();

  const showToast = () => {
    setToastVisible(true);
  };

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    const url = `${BASE_URL}/api/auth/login`;
    try {
      const response = await axios.post(url, data);
      const { jwtToken, name, email } = response.data;

      localStorageInstance?.setItem('token', jwtToken);
      localStorageInstance?.setItem('loggedInUser', name);
      localStorageInstance?.setItem('loggedInUserEmail', email);

      setToastMessage("Logged in successfully!");
      showToast()
      window.location.href = "/entertainment-hub";
    } catch (error) {
      console.error(error);
      setToastMessage("Invalid email or password!");
      showToast()
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async (response: any) => {
    if (response.credential) {
      const googleAccessToken = response.credential;

      // Send the Google Access Token to your backend for verification and login
      try {
        const res = await axios.post('http://localhost:8000/api/auth/google', {
          googleAccessToken,
        });

        // Handle successful login response from the backend
        if (res.data.success) {
          localStorage.setItem('token', res.data.jwtToken);
          localStorage.setItem('loggedInUser', res.data.name);
          localStorage.setItem('loggedInUserEmail', res.data.email);
          console.log('Logged in successfully!', res.data);
        } else {
          console.error('Google login failed:', res.data.message);
        }
      } catch (err) {
        console.error('Error logging in with Google:', err);
      }
    }
  };

  useEffect(() => {
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
        <div className="grid grid-cols-1 gap-4 w-full">
          {/* <Button variant="outline" className="w-full" disabled={isLoading} onClick={() => signIn('google')}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button> */}
          <GoogleLogin
            logo_alignment="center"
            text="continue_with"
            theme="outline"
            onSuccess={cr => handleGoogleLogin(cr)}
            onError={() => console.log('Login Failed')}
            useOneTap
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
      <MessageToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        isError
      />
    </Card>
  );
}
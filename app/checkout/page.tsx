// app/checkout/page.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from "@/components/layout/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input2";
import { Label } from "@/components/ui/label2";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface PlanDetails {
    name: string;
    price: string;
    billingType: string;
    features: string[];
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });

    useEffect(() => {
        const plan = searchParams.get('plan');
        const price = searchParams.get('price');
        const billing = searchParams.get('billing');
        const features = searchParams.get('features')?.split('|') || [];

        if (plan && price && billing) {
            setPlanDetails({
                name: plan,
                price: price,
                billingType: billing,
                features: features
            });
        }
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle payment processing
        console.log('Processing payment...', formData);
        // Add your payment processing logic here
    };

    if (!planDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-sm mb-8 hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Checkout Form */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Complete your purchase</CardTitle>
                                    <CardDescription>Enter your details to proceed with payment</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <Input
                                                id="cardNumber"
                                                name="cardNumber"
                                                required
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                                <Input
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    required
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input
                                                    id="cvv"
                                                    name="cvv"
                                                    required
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postalCode">Postal Code</Label>
                                                <Input
                                                    id="postalCode"
                                                    name="postalCode"
                                                    required
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                required
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full">
                                            Complete Purchase
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                    <CardDescription>Review your plan details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{planDetails.name}</h3>
                                            <p className="text-sm text-muted-foreground">{planDetails.billingType}</p>
                                        </div>

                                        <div className="text-2xl font-bold">
                                            ${planDetails.price}
                                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Features included:</h4>
                                            {planDetails.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
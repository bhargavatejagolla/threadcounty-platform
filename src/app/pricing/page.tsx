'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring the platform.',
    features: ['5 Image Uploads per month', 'Basic Thread Density', 'Standard Support'],
    buttonText: 'Get Started',
  },
  {
    name: 'Student',
    price: '$9/mo',
    description: 'For textile students and researchers.',
    features: ['50 Image Uploads per month', 'Advanced AI Analysis', 'Weave Pattern Detection', 'Priority Email Support'],
    buttonText: 'Subscribe Student',
  },
  {
    name: 'Professional',
    price: '$49/mo',
    description: 'For industry professionals.',
    features: ['Unlimited Uploads', 'Premium AI Analysis', 'Downloadable PDF Reports', 'Defect Detection', '24/7 Support'],
    buttonText: 'Subscribe Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large textile manufacturers.',
    features: ['API Access', 'Custom AI Model Training', 'Dedicated Account Manager', 'On-premise Deployment Options'],
    buttonText: 'Contact Sales',
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the perfect plan for your textile analysis needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center text-sm py-1 font-medium rounded-t-lg -mt-[1px] -mx-[1px]">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

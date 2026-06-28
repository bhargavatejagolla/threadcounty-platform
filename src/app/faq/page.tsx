'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How accurate is the AI analysis?',
    answer: 'Our models are trained on tens of thousands of high-resolution fabric images and currently achieve over 95% accuracy for standard thread density and warp/weft counts on solid fabrics.',
  },
  {
    question: 'What image formats do you support?',
    answer: 'We currently support JPG, JPEG, and PNG formats. For best results, we recommend uploading clear, well-lit images of your fabric samples.',
  },
  {
    question: 'Can I use this for complex weave patterns?',
    answer: 'Yes! Our advanced AI models can detect plain, twill, satin, and jacquard weaves. However, highly complex or irregular weaves might require manual verification.',
  },
  {
    question: 'What are the limits on the free plan?',
    answer: 'The free plan includes 5 image uploads per month. If you need more, consider upgrading to our Student or Professional plans.',
  },
  {
    question: 'Is my uploaded data secure?',
    answer: 'Absolutely. We use Supabase for secure database and storage management. Your images and reports are private to your account unless you explicitly choose to share them.',
  },
  {
    question: 'Do you offer an API?',
    answer: 'Yes, API access is available on our Enterprise plan. Please contact sales to discuss your specific integration requirements.',
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about the ThreadCounty platform and AI.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

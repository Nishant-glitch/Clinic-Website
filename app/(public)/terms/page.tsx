import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Container, PageHero, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: `Terms of Service & Medical Disclaimer | ${siteConfig.name}`,
  description: `Terms of service and medical advice disclaimer for visitors and patients of Dr. Sharma's Family Care Clinic in Andheri West, Mumbai.`,
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="space-y-12 md:space-y-16 pb-16">
      <PageHero
        breadcrumbs={[{ label: "Terms of Service" }]}
        eyebrow="Website Usage Notice"
        title="Terms of Service &amp; Medical Disclaimer"
        subtitle="Important information regarding medical advice disclaimers, appointment scheduling, and informational content."
      />

      <section className="py-2">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Medical Disclaimer Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-md-error-container/20 border border-md-error/30 text-xs flex items-start gap-3.5">
              <AlertTriangle className="h-5 w-5 text-md-error flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-md-error">
                  Important Medical Advice Disclaimer
                </p>
                <p className="text-md-on-surface-variant leading-relaxed">
                  The information provided on this website—including service descriptions, articles, symptom lists, and treatment summaries—is strictly for general educational purposes. It does NOT constitute medical diagnosis, treatment advice, or a physician-patient relationship. Always seek the direct guidance of a qualified healthcare professional for any medical condition.
                </p>
              </div>
            </div>

            <Card variant="container" className="p-6 sm:p-10 space-y-6 text-sm text-md-on-surface-variant leading-relaxed border border-md-outline/10">
              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or browsing this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, alongside our{" "}
                  <Link href="/privacy-policy" className="text-md-primary underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  2. Emergency Medical Situations
                </h2>
                <p className="font-semibold text-md-error">
                  This website and our online callback request forms are NOT designed for acute emergency medical care.
                </p>
                <p>
                  If you or a loved one is experiencing severe chest pain, radiating numbness, acute breathlessness, uncontrolled bleeding, severe trauma, or signs of stroke, please dial emergency services immediately (108 / 112) or proceed to the nearest hospital emergency room.
                </p>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  3. Appointment Requests &amp; Confirmation
                </h2>
                <p>
                  Submitting an online appointment form constitutes an inquiry for a consultation slot. A consultation is only confirmed once our clinic front desk contacts you by telephone or WhatsApp and formally locks your scheduled arrival time. We reserve the right to reschedule consultation slots in the event of unexpected emergency clinical demands.
                </p>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  4. Intellectual Property
                </h2>
                <p>
                  All clinic content, logos, text descriptions, and design tokens displayed on this site are the property of Dr. Sharma&apos;s Family Care Clinic and may not be copied, reproduced, or republished without written permission.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="headline-sm font-bold text-md-on-background">
                  5. Governing Law
                </h2>
                <p>
                  These terms are governed by the laws of the Republic of India. Any disputes arising out of website usage shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}

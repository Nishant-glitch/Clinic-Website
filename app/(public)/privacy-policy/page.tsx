import * as React from "react";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Container, PageHero, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy policy and patient personal data protection disclosure for Dr. Sharma's Family Care Clinic under India's Digital Personal Data Protection (DPDP) Act 2023.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 md:space-y-16 pb-16">
      <PageHero
        breadcrumbs={[{ label: "Privacy Policy" }]}
        eyebrow="Data Protection Notice"
        title="Privacy Policy &amp; Consent Terms"
        subtitle="Our commitment to safeguarding patient data in compliance with India's Digital Personal Data Protection (DPDP) Act 2023."
      />

      <section className="py-2">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Legal Notice Disclaimer Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Important Legal Notice</p>
                <p className="mt-0.5 leading-relaxed">
                  Placeholder document for Dr. Sharma&apos;s Family Care Clinic. Please review and customize with a certified legal professional prior to production deployment.
                </p>
              </div>
            </div>

            <Card variant="container" className="p-6 sm:p-10 space-y-6 text-sm text-md-on-surface-variant leading-relaxed border border-md-outline/10">
              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  1. Information We Collect
                </h2>
                <p>
                  When you submit an appointment request or contact inquiry on our website, we collect only the minimal data necessary to coordinate your medical visit:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                  <li><strong className="text-md-on-background">Identity Data:</strong> Your full name.</li>
                  <li><strong className="text-md-on-background">Contact Data:</strong> Your 10-digit Indian mobile number and optional email address.</li>
                  <li><strong className="text-md-on-background">Appointment Preferences:</strong> Preferred consultation date, preferred time slot (morning/evening), and requested clinical service.</li>
                  <li><strong className="text-md-on-background">Optional Health Inquiries:</strong> Any brief symptoms or questions you voluntarily provide in the message field.</li>
                </ul>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  2. Purpose of Data Processing
                </h2>
                <p>
                  Under India&apos;s Digital Personal Data Protection (DPDP) Act 2023, your personal data is collected solely for explicit, lawful purposes:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                  <li>To call back or message you via WhatsApp to confirm doctor availability and lock your consultation slot.</li>
                  <li>To provide directions and arrival instructions for our Andheri West clinic.</li>
                  <li>To answer administrative inquiries regarding consultation fees or test reports.</li>
                </ul>
                <p className="text-xs font-semibold text-md-on-background pt-1">
                  We strictly never sell, rent, commercialize, or share your contact number with third-party pharmaceutical companies, advertisers, or insurance telemarketers.
                </p>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  3. Data Retention &amp; Security
                </h2>
                <p>
                  Inquiry records and callback requests are maintained within encrypted, role-restricted clinical databases accessible only by authorized administrative and medical staff. Records of unconfirmed inquiries are purged periodically once the consultation window has passed.
                </p>
              </div>

              <div className="space-y-2 border-b border-md-outline/10 pb-4">
                <h2 className="headline-sm font-bold text-md-on-background">
                  4. Your Rights (Access, Correction &amp; Deletion)
                </h2>
                <p>
                  In accordance with the DPDP Act 2023, you retain full rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                  <li>The right to request a summary of personal data held about you.</li>
                  <li>The right to request correction of inaccurate contact numbers or names.</li>
                  <li>The right to request the deletion or erasure of your inquiry history.</li>
                  <li>The right to withdraw your consent at any time without penalty.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="headline-sm font-bold text-md-on-background">
                  5. Contact Our Data Grievance Desk
                </h2>
                <p>
                  To exercise your data protection rights, request information deletion, or submit a grievance, please write directly to our clinic administration:
                </p>
                <div className="p-4 rounded-2xl bg-md-surface-container-low text-xs space-y-1 border border-md-outline/10 mt-2">
                  <p className="font-bold text-md-on-background">{siteConfig.name}</p>
                  <p>Attn: Patient Privacy &amp; Data Protection Officer</p>
                  <p>Address: {siteConfig.address.fullAddress}</p>
                  <p>Email: <a href={`mailto:${siteConfig.email}`} className="text-md-primary font-semibold hover:underline">{siteConfig.email}</a></p>
                  <p>Phone: {siteConfig.phoneDisplay}</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}

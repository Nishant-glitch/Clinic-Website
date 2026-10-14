import * as React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getFaqs } from "@/lib/data";
import {
  Container,
  SectionHeading,
  Accordion,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { siteConfig } from "@/lib/config/site";

export async function FAQSection() {
  const faqs = await getFaqs();
  const accordionItems = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello doctor, I have a medical question before visiting the clinic."
  )}`;

  return (
    <section id="faq" className="py-12 md:py-20">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Clear Answers"
            title="Frequently Asked Questions"
            subtitle="Common questions regarding OPD hours, appointment confirmations, and clinic procedures."
          />
        </MotionReveal>

        <div className="max-w-3xl mx-auto mt-12">
          <MotionReveal delay={0.1}>
            <Accordion items={accordionItems} defaultOpenId="faq-1" />
          </MotionReveal>

          {/* Quick Support Footnote */}
          <MotionReveal delay={0.2} className="mt-10 text-center">
            <p className="text-xs md:text-sm text-md-on-surface-variant">
              Have another question not listed here?{" "}
              <Link href="/contact" className="font-semibold text-md-primary hover:underline">
                Contact our front desk
              </Link>{" "}
              or{" "}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </p>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}

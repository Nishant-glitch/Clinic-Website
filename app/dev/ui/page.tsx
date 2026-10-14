import { notFound } from "next/navigation";
import {
  Button,
  ButtonLink,
  IconButton,
  FAB,
  Card,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  SectionHeading,
  Container,
  Accordion,
} from "@/components/ui";
import { ArrowRight, Phone, Heart, Calendar, Plus, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Dev UI Showcase | Clinic Platform",
  robots: "noindex, nofollow",
};

export default function DevUIPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="py-12 bg-md-background min-h-screen text-md-on-background">
      <Container className="space-y-16">
        <div className="border-b border-md-outline/20 pb-6">
          <Badge variant="primary" size="md">
            Development Only
          </Badge>
          <h1 className="headline-lg font-bold text-md-on-background mt-3">
            Material You UI Component Showcase
          </h1>
          <p className="body-md text-md-on-surface-variant mt-2">
            Visual QA testbed for tokens, pill shapes, states, and accessibility focus rings.
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-6">
          <SectionHeading title="Buttons & Links" subtitle="Pill shaped, state layers, active:scale-95" align="left" />
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="filled">Filled (Primary)</Button>
            <Button variant="tonal">Tonal (Secondary)</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text Button</Button>
            <Button variant="filled" isLoading>
              Loading
            </Button>
            <Button variant="filled" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="filled" size="sm" leftIcon={<Calendar className="h-3.5 w-3.5" />}>
              Small (h-9)
            </Button>
            <Button variant="filled" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Medium (h-10)
            </Button>
            <Button variant="filled" size="lg" leftIcon={<Phone className="h-5 w-5" />}>
              Large (h-12)
            </Button>
            <ButtonLink href="/appointment" variant="tonal" size="md">
              ButtonLink Component
            </ButtonLink>
          </div>
        </section>

        {/* IconButtons & FAB */}
        <section className="space-y-6">
          <SectionHeading title="Icon Buttons & Floating Action Buttons" align="left" />
          <div className="flex flex-wrap items-center gap-6">
            <IconButton variant="filled" aria-label="Add item">
              <Plus className="h-5 w-5" />
            </IconButton>
            <IconButton variant="tonal" aria-label="Favorite">
              <Heart className="h-5 w-5" />
            </IconButton>
            <IconButton variant="outlined" aria-label="Phone">
              <Phone className="h-5 w-5" />
            </IconButton>
            <IconButton variant="standard" aria-label="Message">
              <MessageCircle className="h-5 w-5" />
            </IconButton>

            <div className="h-10 w-px bg-md-outline/20 mx-2" />

            <FAB variant="tertiary" aria-label="Tertiary action">
              <Plus className="h-6 w-6" />
            </FAB>
            <FAB variant="primary" aria-label="Primary action">
              <Calendar className="h-6 w-6" />
            </FAB>
            <FAB variant="whatsapp" aria-label="Chat on WhatsApp">
              <MessageCircle className="h-6 w-6" />
            </FAB>
            <FAB variant="call" aria-label="Call clinic">
              <Phone className="h-6 w-6" />
            </FAB>
          </div>
        </section>

        {/* Badges / Chips */}
        <section className="space-y-6">
          <SectionHeading title="Badges & Chips" align="left" />
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">Secondary Container</Badge>
            <Badge variant="primary">Primary Tint</Badge>
            <Badge variant="tertiary">Tertiary Warm</Badge>
            <Badge variant="outline">Outlined Chip</Badge>
            <Badge variant="success">Verified Patient</Badge>
            <Badge variant="error">High Priority</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <SectionHeading title="Cards (24px Radius)" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="container">
              <h3 className="title-lg font-bold">Surface Container Card</h3>
              <p className="body-md text-md-on-surface-variant mt-2">
                Standard background card for clinical content and layout blocks.
              </p>
            </Card>
            <Card variant="low">
              <h3 className="title-lg font-bold">Surface Container Low</h3>
              <p className="body-md text-md-on-surface-variant mt-2">
                Subtler background level for secondary content cards.
              </p>
            </Card>
            <Card variant="container" interactive>
              <Badge variant="tertiary" size="sm" className="mb-2">
                Interactive
              </Badge>
              <h3 className="title-lg font-bold">Interactive Card</h3>
              <p className="body-md text-md-on-surface-variant mt-2">
                Hover to see smooth elevation rise and scale-[1.02] micro-animation.
              </p>
            </Card>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="space-y-6">
          <SectionHeading title="Form Inputs (Material Filled Style)" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <Input
              label="Full Name"
              placeholder="e.g. Ramesh Kumar"
              helperText="Enter patient's official name"
              required
            />
            <Input
              label="Mobile Number"
              placeholder="e.g. 9876543210"
              error="Please enter a valid 10-digit Indian phone"
              required
            />
            <Select
              label="Preferred Consultation Slot"
              options={[
                { label: "Any Available Time", value: "any" },
                { label: "Morning OPD (10:00 AM - 1:30 PM)", value: "morning" },
                { label: "Evening OPD (5:30 PM - 9:00 PM)", value: "evening" },
              ]}
            />
            <Textarea
              label="Health Concern / Symptom Details"
              placeholder="Describe what you are experiencing..."
              helperText="Max 500 characters"
            />
            <div className="md:col-span-2">
              <Checkbox
                required
                label="I consent to the clinic processing my details and calling me back to confirm consultation (India DPDP Act 2023)."
              />
            </div>
          </div>
        </section>

        {/* Accordion */}
        <section className="space-y-6">
          <SectionHeading title="Accessible Accordion (FAQ Style)" align="left" />
          <div className="max-w-3xl">
            <Accordion
              items={[
                {
                  id: "faq-demo-1",
                  question: "How does the request-based appointment booking work?",
                  answer:
                    "You submit your request online, and our reception team verifies doctor availability and calls you to confirm the exact consultation time.",
                },
                {
                  id: "faq-demo-2",
                  question: "Is there a consultation fee for follow-up visits?",
                  answer:
                    "Routine follow-up within 7 days for the same acute illness is covered under your initial consultation.",
                },
              ]}
            />
          </div>
        </section>
      </Container>
    </div>
  );
}

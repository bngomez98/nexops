import { LegalShell, Section } from "@/components/legal-shell"

export const metadata = {
  title: "Privacy Policy | Nexus Operations",
  description: "Privacy Policy for the Nexus Operations property service management platform.",
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="March 5, 2026">
      <Section title="1. Information We Collect">
        We collect information you provide directly, including: full name, email address, phone number, property address, project descriptions, photographs, and stated budget ranges. For contractor accounts, we additionally collect: business name, contractor license number, and insurance carrier and policy details. We also collect usage data through cookies and similar technologies as described in Section 5.
      </Section>

      <Section title="2. How We Use Your Information">
        Your information is used to: operate and improve the Platform; match property owners with qualified contractors; coordinate and confirm consultation appointments; process service fees where applicable; send transactional communications (assignment notifications, confirmation emails, scheduling reminders); and respond to support inquiries. We do not sell your personal information to third parties under any circumstances.
      </Section>

      <Section title="3. Information Sharing">
        Project details submitted by property owners — including photographs, scope descriptions, address, and budget ceiling — are shared with one matched contractor after that contractor claims the request. This sharing is limited to the single claiming contractor. We do not distribute your project information to multiple contractors, lead brokers, marketing firms, or aggregation services.
      </Section>

      <Section title="4. Data Security">
        We use encryption in transit (TLS) and at rest for all stored data. Access to personal data is restricted to authorized personnel. We conduct regular security reviews. No method of electronic transmission is unconditionally secure; you assume the residual risks inherent to any internet-based communication.
      </Section>

      <Section title="5. Cookies and Tracking">
        We use session cookies for authentication and preference storage. We do not use third-party advertising cookies. Analytics data is collected in aggregate, not individually identifiable form. You may disable cookies in your browser, which may affect Platform functionality.
      </Section>

      <Section title="6. Third-Party Services">
        We use Supabase for database and authentication, Zendesk for customer support, and standard email providers for transactional messages. Each provider operates under their own data processing agreements. We do not use third-party advertising networks.
      </Section>

      <Section title="7. Data Retention">
        Account data is kept for the life of the account. Following account closure, we retain a limited subset of data for up to 36 months to satisfy legal and dispute resolution obligations. Project documentation and photographs are retained for up to 5 years after project completion. You may request deletion of your account and associated data at any time by emailing <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a>. Legal obligations may require us to retain certain transaction-related data even after a deletion request — we will be clear about what we can and cannot remove.
      </Section>

      <Section title="8. Your Rights">
        You have the right to: access a copy of the personal data we hold about you; correct inaccurate data; request deletion of your account and associated data subject to retention requirements; opt out of non-transactional email communications at any time via the unsubscribe link. To exercise any of these rights, contact us at the address below.
      </Section>

      <Section title="9. Children">
        The Platform is not intended for persons under 18 years of age. We do not knowingly collect personal information from minors. If you become aware that a minor has submitted information to the Platform, contact us immediately.
      </Section>

      <Section title="10. Policy Updates">
        We may update this Privacy Policy. Material changes will be communicated to registered users via email at least 14 days before taking effect. The effective date of the current version appears at the top of this document.
      </Section>

      <Section title="11. Contact">
        Privacy inquiries: <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a><br />
        Nexus Operations, LLC — Topeka, KS 66606<br />
        Phone: <a href="tel:+17854280244" className="text-primary hover:underline">(785) 428-0244</a>
      </Section>
    </LegalShell>
  )
}

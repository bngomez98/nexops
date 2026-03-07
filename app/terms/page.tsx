import { LegalShell, Section } from "@/components/legal-shell"

export const metadata = {
  title: "Terms of Service | Nexus Operations",
  description: "Terms of Service for the Nexus Operations property service management platform.",
}

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="March 5, 2026">
      <Section title="1. Acceptance of Terms">
        By accessing or using Nexus Operations ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. These terms constitute a binding legal agreement between you and Nexus Operations, LLC.
      </Section>

      <Section title="2. Platform Description">
        Nexus Operations is a property service coordination platform that connects property owners, homeowners, and property managers with licensed, insured, and background-checked contractors in the Topeka, Kansas metropolitan area. The Platform manages exclusive project assignment — one contractor per submitted request. Nexus Operations is not a contractor, does not perform any work, and is not a party to any agreement between property owners and contractors.
      </Section>

      <Section title="3. User Eligibility">
        You must be at least 18 years of age and have legal authority to enter into binding agreements to use the Platform. If registering on behalf of a business, you represent that you have authority to bind that entity to these Terms.
      </Section>

      <Section title="4. Property Owner and Manager Responsibilities">
        Property owners and managers agree to: (a) provide accurate project information, including photographs, a written scope of work, and a realistic budget cap; (b) be present or represented at confirmed consultations; (c) communicate any cancellations no fewer than 24 hours in advance; and (d) not contact contractors outside the Platform prior to a confirmed consultation.
      </Section>

      <Section title="5. Contractor Responsibilities">
        Contractors agree to: (a) maintain current, valid licenses and insurance as required by their trade and the State of Kansas; (b) pass and maintain a satisfactory background check; (c) contact the property owner only through Platform-designated channels prior to the consultation; (d) arrive at confirmed consultations as scheduled; and (e) provide a written, itemized estimate within the agreed budget ceiling unless scope discovered on-site materially differs.
      </Section>

      <Section title="6. Exclusive Assignment Policy">
        When a contractor claims a request, that request is immediately removed from all other contractors' feeds. The claiming contractor has exclusive rights to that project. Contractors who claim a request and fail to conduct the scheduled consultation without valid cause may have their account suspended.
      </Section>

      <Section title="7. Fees">
        The Platform is free for property owners and property managers. Contractors pay a membership fee as described in their separate contractor membership agreement. All fees are non-refundable except as expressly stated in writing by Nexus Operations.
      </Section>

      <Section title="8. No Guarantee of Outcome">
        Nexus Operations does not guarantee that a project submission will result in a contractor claim, a consultation, or a contract for work. The Platform does not guarantee the quality, timeliness, or outcome of any work performed by contractors. Property owners engage contractors at their own discretion.
      </Section>

      <Section title="9. Limitation of Liability">
        To the maximum extent permitted by law, Nexus Operations, LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim arising under these Terms is limited to the amount you paid us in the twelve months preceding the claim.
      </Section>

      <Section title="10. Indemnification">
        You agree to indemnify and hold harmless Nexus Operations, LLC, its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses (including attorneys' fees) arising from your use of the Platform or your violation of these Terms.
      </Section>

      <Section title="11. Account Termination">
        Nexus Operations reserves the right to suspend or terminate any account for violation of these Terms, fraudulent activity, or conduct that undermines the integrity of the Platform, with or without prior notice.
      </Section>

      <Section title="12. Modifications">
        We may modify these Terms at any time. Continued use of the Platform after any changes constitutes your acceptance of the updated Terms. Material changes will be communicated via the email address on your account.
      </Section>

      <Section title="13. Governing Law and Disputes">
        These Terms are governed by the laws of the State of Kansas. Any disputes arising from or related to these Terms or your use of the Platform shall be resolved exclusively in the state or federal courts of Shawnee County, Kansas.
      </Section>

      <Section title="14. Contact">
        Questions about these Terms: <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a> — Nexus Operations, LLC, Topeka, KS 66606. Phone: <a href="tel:+17854280244" className="text-primary hover:underline">(785) 428-0244</a>.
      </Section>
    </LegalShell>
  )
}

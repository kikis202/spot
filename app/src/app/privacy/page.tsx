import { MainLayout } from "@/components/app-layout";
import { H1, H2 } from "@/components/ui/typography";

const Privacy = () => {
  return (
    <div className="space-y-6 mb-24">
      <H1>Privacy Policy</H1>
      <section>
        <H2>Introduction</H2>
        <p className="text-muted-foreground">
          Welcome to our website. We are committed to protecting your personal
          information and your right to privacy. This privacy policy outlines
          our policies and practices regarding your information and how we will
          treat it.
        </p>
      </section>
      <section>
        <H2>Information Collected</H2>
        <p className="text-muted-foreground">
          We collect personal information that you voluntarily provide to us
          when you use our services. The personal information that we collect
          depends on the context of your interactions with us and the services,
          the choices you make and the features you use.
        </p>
      </section>
      <section>
        <H2>Use of Information</H2>
        <p className="text-muted-foreground">
          We use personal information collected via our services for a variety
          of business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests, in order to enter into or perform a contract with you, with
          your consent, and/or for compliance with our legal obligations.
        </p>
      </section>
      <section>
        <H2>Data Storage and Security</H2>
        <p className="text-muted-foreground">
          We have implemented appropriate technical and organizational security
          measures designed to protect the security of any personal information
          we process. However, despite our safeguards and efforts to secure your
          information, no electronic transmission over the Internet or
          information storage technology can be guaranteed to be 100% secure.
        </p>
      </section>
      <section>
        <H2>Sharing of Information</H2>
        <p className="text-muted-foreground">
          We only share information with your consent, to comply with laws, to
          provide you with services, to protect your rights, or to fulfill
          business obligations.
        </p>
      </section>
      <section>
        <H2>Cookies and Tracking Technologies</H2>
        <p className="text-muted-foreground">
          We don&apos;t use cookies or other tracking technologies to track your
        </p>
      </section>
      <section>
        <H2>User Rights</H2>
        <p className="text-muted-foreground">
          You have certain rights under applicable data protection laws. These
          may include the right to request access and obtain a copy of your
          personal information, to request rectification or erasure; to restrict
          the processing of your personal information; and, if applicable, to
          data portability.
        </p>
      </section>
      <section>
        <H2>Data Retention</H2>
        <p className="text-muted-foreground">
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy policy, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting or other legal requirements).
        </p>
      </section>
      <section>
        <H2>Third-Party Links</H2>
        <p className="text-muted-foreground">
          Our services may contain links to other websites that are not operated
          by us. If you click on a third party link, you will be directed to
          that third party&apos;s site. We strongly advise you to review the Privacy
          Policy of every site you visit.
        </p>
      </section>
      <section>
        <H2>Updates to the Privacy Policy</H2>
        <p className="text-muted-foreground">
          We may update this privacy policy from time to time. The updated
          version will be indicated by an updated “Revised” date and the updated
          version will be effective as soon as it is accessible.
        </p>
      </section>
      <section>
        <H2>Contact Information</H2>
        <p className="text-muted-foreground">
          If you have questions or comments about this policy, you may contact
          our Data Protection Officer (DPO) by email at privacy@spot.com.
        </p>
      </section>
    </div>
  );
};

export default function PrivacyPage() {
  return (
    <MainLayout>
      <Privacy />
    </MainLayout>
  );
}

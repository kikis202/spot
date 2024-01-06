import { MainLayout } from "@/components/app-layout";
import { H1, H2 } from "@/components/ui/typography";
import Link from "next/link";

const TOS = () => {
  return (
    <div className="pb-24">
      <H1>Terms of Service</H1>
      <section className="mt-6 space-y-8">
        <div>
          <H2>Introduction</H2>
          <p className="text-muted-foreground">
            Welcome to our package sending and tracking website. By using our
            services, you agree to abide by the terms and conditions outlined in
            this document.
          </p>
        </div>
        <div>
          <H2>User Responsibilities</H2>
          <p className="text-muted-foreground">
            As a user, you are responsible for providing accurate information,
            complying with applicable laws and regulations, and not engaging in
            any illegal activities.
          </p>
        </div>
        <div>
          <H2>Account Creation</H2>
          <p className="text-muted-foreground">
            To use our services, you will need to create an account. You are
            responsible for maintaining the confidentiality of your account
            credentials.
          </p>
        </div>
        <div>
          <H2>Package Sending</H2>
          <p className="text-muted-foreground">
            When sending packages through our website, please follow our
            packaging requirements and ensure that the contents of your package
            are acceptable and do not violate any restrictions or prohibitions.
          </p>
        </div>
        <div>
          <H2>Package Tracking</H2>
          <p className="text-muted-foreground">
            You can track your packages using our tracking system. Please note
            that the accuracy or availability of tracking information may vary.
          </p>
        </div>
        <div>
          <H2>Payment and Pricing</H2>
          <p className="text-muted-foreground">
            Our pricing model is based on the size and weight of the package. We
            accept various payment methods. Please refer to our refund and
            cancellation policies for more information.
          </p>
        </div>
        <div>
          <H2>Intellectual Property</H2>
          <p className="text-muted-foreground">
            All content and intellectual property on our website are protected
            by copyright laws. Unauthorized use, reproduction, or distribution
            of our content is strictly prohibited.
          </p>
        </div>
        <div>
          <H2>Privacy Policy</H2>
          <p className="text-muted-foreground">
            By using our website, you consent to the collection and processing
            of your personal information as outlined in our{" "}
            <Link className="underline" href="/prrivacy">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div>
          <H2>Limitation of Liability</H2>
          <p className="text-muted-foreground">
            We are not liable for any damages or losses incurred while using our
            website. We are also not responsible for any delays, errors, or
            issues related to package sending or tracking.
          </p>
        </div>
        <div>
          <H2>Termination</H2>
          <p className="text-muted-foreground">
            We reserve the right to terminate or suspend user accounts under
            certain circumstances. Users can also request account termination.
          </p>
        </div>
        <div>
          <H2>Governing Law</H2>
          <p className="text-muted-foreground">
            The interpretation and enforcement of these terms and conditions are
            governed by the laws of our jurisdiction. Any disputes arising from
            the use of our website will be resolved in our designated
            jurisdiction.
          </p>
        </div>
        <div>
          <H2>Modifications</H2>
          <p className="text-muted-foreground">
            We reserve the right to modify or update these terms of service at
            any time. Users will be notified of any changes, and continued use
            of the website constitutes acceptance of the modified terms.
          </p>
        </div>
      </section>
    </div>
  );
};

export default function TOSPage() {
  return (
    <MainLayout>
      <TOS />
    </MainLayout>
  );
}

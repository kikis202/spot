import { MainLayout } from "@/components/app-layout";
import {
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
  Accordion,
} from "@/components/ui/accordion";
import { H1 } from "@/components/ui/typography";

const FAQ = () => {
  return (
    <>
      <H1 className="mb-4 text-3xl font-bold">Frequently Asked Questions</H1>
      <p className="mb-8 text-lg text-muted-foreground">
        Here are some of the most common questions we get from our customers. If
        you can&apos;t find what you&apos;re looking for, please get in touch.
      </p>
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>How can I send a parcel?</AccordionTrigger>
          <AccordionContent>
            To send a parcel, you must be signed in our website and click on the
            &quot;Send parcel&quot; button in navigation menu. Follow the
            instructions to fill in the required details and choose the desired
            delivery options.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How can I track my parcel?</AccordionTrigger>
          <AccordionContent>
            To track your parcel, you can enter the tracking number provided to
            you in the &quot;Find parcel&quot; section on our website. Click on
            the &quot;Track&quot; button to get real-time updates on the status
            and location of your parcel.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What are the delivery options available?
          </AccordionTrigger>
          <AccordionContent>
            We offer delivery via courier from/to custom locations or via parcel
            lockers. You can choose the desired delivery option when sending
            your parcel.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            How can I change the delivery address?
          </AccordionTrigger>
          <AccordionContent>
            If you need to change the delivery address after placing the order,
            please contact our customer support team as soon as possible. They
            will assist you in updating the address based on the feasibility.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            What should I do if my parcel is damaged or lost?
          </AccordionTrigger>
          <AccordionContent>
            In the unfortunate event of a damaged or lost parcel, please reach
            out to our customer support team immediately. Provide them with the
            necessary details, such as the tracking number and description of
            the issue. We will investigate the matter and take appropriate
            action to resolve it.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default function FAQPage() {
  return (
    <MainLayout>
      <FAQ />
    </MainLayout>
  );
}

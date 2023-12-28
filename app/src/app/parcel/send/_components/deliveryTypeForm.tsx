"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ParcelSize } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const sendingOptions = ["parcelMachine", "courier"] as const;

const deliverySchema = z.object({
  weight: z.number().min(30).max(100).default(30),
  size: z.nativeEnum(ParcelSize),
  notes: z.string().optional(),
  origin: z.enum(sendingOptions),
  destination: z.enum(sendingOptions),
});

const DeliveryType = ({ nextStep }: { nextStep: () => void }) => {
  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      size: ParcelSize.SMALL,
      weight: 30,
      origin: "parcelMachine",
      destination: "parcelMachine",
    },
  });

  const onSubmit = (data: z.infer<typeof deliverySchema>) => {
    console.log(data);
    nextStep();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcel size</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    className="justify-start"
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <ToggleGroupItem value={ParcelSize.SMALL}>
                      {ParcelSize.SMALL}
                    </ToggleGroupItem>
                    <ToggleGroupItem value={ParcelSize.MEDIUM}>
                      {ParcelSize.MEDIUM}
                    </ToggleGroupItem>
                    <ToggleGroupItem value={ParcelSize.LARGE}>
                      {ParcelSize.LARGE}
                    </ToggleGroupItem>
                    <ToggleGroupItem value={ParcelSize.XLARGE}>
                      {ParcelSize.XLARGE}
                    </ToggleGroupItem>
                    <ToggleGroupItem value={ParcelSize.CUSTOM}>
                      {ParcelSize.CUSTOM}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send from</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    className="justify-start"
                    onValueChange={field.onChange}
                    {...field}
                  >
                    {sendingOptions.map((option) => (
                      <ToggleGroupItem key={option} value={option}>
                        {option}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send to</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    className="justify-start"
                    onValueChange={field.onChange}
                    {...field}
                  >
                    {sendingOptions.map((option) => (
                      <ToggleGroupItem key={option} value={option}>
                        {option}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your order notes here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default DeliveryType;

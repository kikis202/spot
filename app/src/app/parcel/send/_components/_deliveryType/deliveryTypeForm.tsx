"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { H2 } from "@/components/ui/typography";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParcelSize } from "@prisma/client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ParcelSizeUI } from "~/helpers/enumTranslations";

const sendingOptions = ["parcelMachine", "courier"] as const;

const deliverySchema = z
  .object({
    weight: z.number().min(1).max(100).optional(),
    width: z.number().min(1).max(100).optional(),
    height: z.number().min(1).max(100).optional(),
    length: z.number().min(1).max(100).optional(),
    size: z.nativeEnum(ParcelSize),
    notes: z.string().optional(),
    origin: z.enum(sendingOptions),
    destination: z.enum(sendingOptions),
    dimensions: z.string().optional(),
  })
  .refine(
    ({ size, origin, destination }) =>
      size !== ParcelSize.CUSTOM ||
      (origin === "courier" && destination === "courier"),
    {
      message: "You can only send custom parcels via courier",
      path: ["size"],
    },
  )
  .refine(
    ({ size, width }) => size !== ParcelSize.CUSTOM || width !== undefined,
    {
      message: "You must specify custom parcel dimensions",
      path: ["width"],
    },
  )
  .refine(
    ({ size, height }) => size !== ParcelSize.CUSTOM || height !== undefined,
    {
      message: "You must specify custom parcel dimensions",
      path: ["height"],
    },
  )
  .refine(
    ({ size, length }) => size !== ParcelSize.CUSTOM || length !== undefined,
    {
      message: "You must specify custom parcel dimensions",
      path: ["length"],
    },
  )
  .refine(
    ({ size, weight }) => size !== ParcelSize.CUSTOM || weight !== undefined,
    {
      message: "You must specify custom parcel dimensions",
      path: ["weight"],
    },
  );

export const deliverySchemaParsed = z.object({
  weight: z.number().min(1).max(100).optional(),
  width: z.number().min(1).max(100).optional(),
  height: z.number().min(1).max(100).optional(),
  length: z.number().min(1).max(100).optional(),
  size: z.nativeEnum(ParcelSize),
  notes: z.string().optional(),
  origin: z.enum(sendingOptions),
  destination: z.enum(sendingOptions),
  dimensions: z.string().optional(),
});

const CustomParcelFields = ({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof deliverySchema>>>;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="w-20"
                  placeholder="cm"
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="w-20"
                  placeholder="cm"
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="w-20"
                  placeholder="cm"
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                className="w-20"
                placeholder="cm"
                onChange={(e) => {
                  field.onChange(parseFloat(e.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const DeliveryType = ({ nextStep }: { nextStep: () => void }) => {
  const data = useMemo(() => getSessionStorageValue("deliveryType", {}), []);

  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      size: ParcelSize.SMALL,
      origin: "parcelMachine",
      destination: "parcelMachine",
      weight: 30,
      width: 10,
      height: 10,
      length: 10,
    },
  });

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    try {
      let parsedData = deliverySchemaParsed.parse(data);
      if (parsedData.size === ParcelSize.CUSTOM && parsedData.dimensions) {
        const [width, height, length] = parsedData.dimensions.split("x");
        if (!width || !height || !length) throw new Error("Invalid dimensions");

        parsedData = {
          ...parsedData,
          width: parseFloat(width),
          height: parseFloat(height),
          length: parseFloat(length),
        };
      }

      form.reset(deliverySchema.parse(parsedData));
    } catch (error) {
      console.log(error);
    }
  }, [data, form]);

  const selectedSize = form.watch("size");

  const onSubmit = (data: z.infer<typeof deliverySchema>) => {
    if (data.size === ParcelSize.CUSTOM) {
      data.dimensions = `${data.width}x${data.height}x${data.length}`;
    } else {
      delete data.weight;
      delete data.dimensions;
    }
    delete data.width;
    delete data.height;
    delete data.length;

    setSessionStorageValue("deliveryType", data);
    nextStep();
  };

  return (
    <div>
      <H2>Information about delivery</H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center space-x-6">
            <div className="my-4 w-fit">
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
                        onValueChange={(event) => {
                          field.onChange(event);
                          if (event === ParcelSize.CUSTOM) {
                            form.setValue("origin", "courier");
                            form.setValue("destination", "courier");
                          }
                        }}
                        {...field}
                      >
                        {Object.values(ParcelSize).map((size) => (
                          <ToggleGroupItem key={size} value={size}>
                            {ParcelSizeUI[size]}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-2" />
              <div className="flex items-center gap-6">
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
                            <ToggleGroupItem
                              disabled={
                                selectedSize === ParcelSize.CUSTOM &&
                                option === "parcelMachine"
                              }
                              key={option}
                              value={option}
                            >
                              {option}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator className="h-20" orientation="vertical" />
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
                            <ToggleGroupItem
                              disabled={
                                selectedSize === ParcelSize.CUSTOM &&
                                option === "parcelMachine"
                              }
                              key={option}
                              value={option}
                            >
                              {option}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {selectedSize === ParcelSize.CUSTOM && (
              <Separator className="mx-2 h-32" orientation="vertical" />
            )}
            <div className={selectedSize !== ParcelSize.CUSTOM ? "hidden" : ""}>
              <CustomParcelFields form={form} />
            </div>
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your order notes here"
                    className="max-w-xl resize-none "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-6" type="submit">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DeliveryType;

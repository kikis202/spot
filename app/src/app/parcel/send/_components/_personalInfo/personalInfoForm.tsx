"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { H2 } from "@/components/ui/typohraphy";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deliverySchemaParsed } from "../_deliveryType/deliveryTypeForm";
import { Input } from "@/components/ui/input";
import { api } from "~/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const addressSchema = z
  .object({
    id: z.string().optional(),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    save: z.boolean(),
    addressName: z.string().optional(),
  })
  .refine(({ save, addressName }) => !save || !!addressName, {
    message: "Address name is required",
    path: ["addressName"],
  });

const contactSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    save: z.boolean(),
    contactName: z.string().optional(),
  })
  .refine(({ save, contactName }) => !save || !!contactName, {
    message: "Contact name is required",
    path: ["contactName"],
  });

export const personalInfoSchema = z.object({
  sender: z.object({
    address: addressSchema,
    contact: contactSchema,
  }),
  receiver: z.object({
    address: addressSchema,
    contact: contactSchema,
  }),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

type PersonalInfoProps = {
  nextStep: () => void;
  resetSteps: () => void;
};

const AddressForm = ({
  form,
  type,
}: {
  form: ReturnType<typeof useForm<PersonalInfoFormValues>>;
  type: "sender" | "receiver";
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`${type}.address.street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Groove Street 123-45"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${type}.address.city`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Los Santos"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${type}.address.postalCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal code</FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder="12345" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${type}.address.country`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="United States of America"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${type}.address.addressName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Save address as</FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder="Home address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const SelectParcelMachine = ({
  form,
  type,
}: {
  form: ReturnType<typeof useForm<PersonalInfoFormValues>>;
  type: "sender" | "receiver";
}) => {
  const { data: parcelMachines, isLoading } =
    api.parcelMachines.getAll.useQuery(undefined, {
      refetchOnWindowFocus: false,
      placeholderData: [],
    });

  if (isLoading) return <div>Loading...</div>;
  if (!parcelMachines) return <div>Something went wrong</div>;

  const data = parcelMachines.map((parcelMachine) => ({
    label: parcelMachine.name,
    value: parcelMachine.id,
    address: parcelMachine.address,
  }));

  return (
    <FormField
      control={form.control}
      name={`${type}.address.id`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Parcel machine</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? data.find(
                        (parcelMachine) => parcelMachine.value === field.value,
                      )?.label
                    : "Select parcel machine"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandEmpty>No parcel machine found.</CommandEmpty>
                <CommandGroup>
                  {data.map((parcelMachine) => (
                    <CommandItem
                      value={parcelMachine.label}
                      key={parcelMachine.value}
                      onSelect={() => {
                        field.onChange(parcelMachine.value);
                        form.setValue(
                          `${type}.address.street`,
                          parcelMachine.address.street,
                        );
                        form.setValue(
                          `${type}.address.city`,
                          parcelMachine.address.city,
                        );
                        form.setValue(
                          `${type}.address.postalCode`,
                          parcelMachine.address.postalCode,
                        );
                        form.setValue(
                          `${type}.address.country`,
                          parcelMachine.address.country,
                        );
                      }}
                    >
                      {parcelMachine.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          parcelMachine.value === field.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Select one of the parcel machines from the list!
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ContactForm = ({
  form,
  type,
}: {
  form: ReturnType<typeof useForm<PersonalInfoFormValues>>;
  type: "sender" | "receiver";
}) => {
  return null;
};

const PersonalInfo = ({ nextStep, resetSteps }: PersonalInfoProps) => {
  const data = useMemo(() => getSessionStorageValue("personalInfo", {}), []) as
    | PersonalInfoFormValues
    | Record<string, never>;
  const deliveryType = useMemo(() => {
    const storageData = getSessionStorageValue("deliveryType", {});

    if (Object.keys(storageData).length === 0) return {};
    try {
      const data = deliverySchemaParsed.parse(storageData);
      return data;
    } catch (e) {
      console.log(e);
      return {};
    }
  }, []) as z.infer<typeof deliverySchemaParsed> | Record<string, never>;

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
  });

  useEffect(() => {
    if (Object.keys(deliveryType).length === 0) resetSteps();
  }, [deliveryType, resetSteps]);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    try {
      form.reset(data);
    } catch (e) {
      console.log(e);
    }
  }, [data, form]);

  const onSubmit = (data: PersonalInfoFormValues) => {
    setSessionStorageValue("personalInfo", data);
    nextStep();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (val) => {console.log(val)})}>
          <H2>Sender</H2>
          <div className="my-6">
            {/* contact */}
            <ContactForm form={form} type="sender" />
            {/* address */}
            {deliveryType.origin === "parcelMachine" && (
              <SelectParcelMachine form={form} type="sender" />
            )}
            {deliveryType.origin === "courier" && (
              <AddressForm form={form} type="sender" />
            )}
          </div>

          <H2>Reciever</H2>
          <div className="my-6">
            {/* contact */}
            <ContactForm form={form} type="receiver" />
            {/* address */}
            {deliveryType.destination === "parcelMachine" && (
              <SelectParcelMachine form={form} type="receiver" />
            )}
            {deliveryType.destination === "courier" && (
              <AddressForm form={form} type="receiver" />
            )}
          </div>

          <Button className="mt-6" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfo;

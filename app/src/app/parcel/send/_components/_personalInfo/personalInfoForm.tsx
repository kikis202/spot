"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { H2 } from "@/components/ui/typography";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { deliverySchemaParsed } from "../_deliveryType/deliveryTypeForm";

const addressSchema = z
  .object({
    id: z.string().optional(),
    parcelMachineName: z.string().optional().default(""),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    save: z.boolean().default(false),
    addressName: z.string().optional().default(""),
  })
  .refine(({ save, addressName }) => !save || !!addressName, {
    message: "Address name is required for saving address",
    path: ["addressName"],
  });

const contactSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    save: z.boolean().default(false),
    contactName: z.string().optional().default(""),
  })
  .refine(({ save, contactName }) => !save || !!contactName, {
    message: "Contact name is required for saving contact",
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

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

type DeliveryTypeForm = ReturnType<typeof useForm<PersonalInfoFormValues>>;

const AddressForm = ({
  form,
  type,
}: {
  form: DeliveryTypeForm;
  type: "sender" | "receiver";
}) => {
  const saveAddress = form.watch(`${type}.address.save`);

  return (
    <>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={`${type}.address.street`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter street" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={`${type}.address.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter city" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={`${type}.address.postalCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter postal code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={`${type}.address.country`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <FormField
          control={form.control}
          name={`${type}.address.save`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    form.setValue(`${type}.address.addressName`, "");
                  }}
                />
              </FormControl>
              <FormLabel>Save Address</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn("space-y-2", !saveAddress && "hidden")}>
        <FormField
          control={form.control}
          name={`${type}.address.addressName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Save address as</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

const SelectParcelMachine = ({
  form,
  type,
}: {
  form: DeliveryTypeForm;
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
                    "justify-between",
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
            <PopoverContent align="end" className="p-0">
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
                          `${type}.address.parcelMachineName`,
                          parcelMachine.label,
                        );
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
  form: DeliveryTypeForm;
  type: "sender" | "receiver";
}) => {
  const saveContact = form.watch(`${type}.contact.save`);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
        <CardDescription>Enter contact details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`${type}.contact.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Enter name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`${type}.contact.phone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`${type}.contact.email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <FormField
            control={form.control}
            name={`${type}.contact.save`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      form.setValue(`${type}.contact.contactName`, "");
                    }}
                  />
                </FormControl>
                <FormLabel>Save Contact</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("space-y-2", !saveContact && "hidden")}>
          <FormField
            control={form.control}
            name={`${type}.contact.contactName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Save contact as</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Enter name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const DeliveryForm = ({
  form,
  type,
  method,
}: {
  form: DeliveryTypeForm;
  type: "sender" | "receiver";
  method: "courier" | "parcelMachine";
}) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{`${
          method === "courier" ? "Address" : "Parcel machine"
        } Details`}</CardTitle>
        <CardDescription>Enter details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* address */}
        {method === "parcelMachine" && (
          <SelectParcelMachine form={form} type={type} />
        )}
        {method === "courier" && <AddressForm form={form} type={type} />}
      </CardContent>
    </Card>
  );
};

const Details = ({
  form,
  type,
  method,
}: {
  form: DeliveryTypeForm;
  type: "sender" | "receiver";
  method: "courier" | "parcelMachine";
}) => {
  return (
    <>
      <H2 className="capitalize">{type}</H2>
      <div className="flex space-x-6">
        {/* contact */}
        <ContactForm form={form} type={type} />
        {/* address */}
        <DeliveryForm form={form} type={type} method={method} />
      </div>
    </>
  );
};

type PersonalInfoProps = {
  nextStep: () => void;
  resetSteps: () => void;
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Details form={form} type="sender" method={deliveryType.origin} />
            <Details
              form={form}
              type="receiver"
              method={deliveryType.destination}
            />
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfo;

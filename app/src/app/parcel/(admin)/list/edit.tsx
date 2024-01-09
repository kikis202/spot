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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { H2 } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { personalInfoSchema } from "~/helpers/dbSchemas";
import { api } from "~/trpc/react";

import type { z } from "zod";
import type { RouterOutputs } from "~/trpc/shared";

type Parcel = RouterOutputs["parcels"]["getAll"]["parcels"][number];

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type PersonalInfoForm = ReturnType<typeof useForm<PersonalInfoFormValues>>;

const AddressForm = ({
  form,
  type,
}: {
  form: PersonalInfoForm;
  type: "sender" | "receiver";
}) => {
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
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter street"
                  onChange={(val) => {
                    field.onChange(val.target.value);
                    form.setValue(`${type}.address.id`, undefined);
                  }}
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
          name={`${type}.address.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter city"
                  onChange={(val) => {
                    field.onChange(val.target.value);
                    form.setValue(`${type}.address.id`, undefined);
                  }}
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
          name={`${type}.address.postalCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter postal code"
                  onChange={(val) => {
                    field.onChange(val.target.value);
                    form.setValue(`${type}.address.id`, undefined);
                  }}
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
          name={`${type}.address.country`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter country"
                  onChange={(val) => {
                    field.onChange(val.target.value);
                    form.setValue(`${type}.address.id`, undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

const ContactForm = ({
  form,
  type,
}: {
  form: PersonalInfoForm;
  type: "sender" | "receiver";
}) => {
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
            name={`${type}.contact.fullName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter name"
                    onChange={(val) => {
                      field.onChange(val.target.value);
                      form.setValue(`${type}.contact.id`, undefined);
                    }}
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
            name={`${type}.contact.phone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    onChange={(val) => {
                      field.onChange(val.target.value);
                      form.setValue(`${type}.contact.id`, undefined);
                    }}
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
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email"
                    onChange={(val) => {
                      field.onChange(val.target.value);
                      form.setValue(`${type}.contact.id`, undefined);
                    }}
                  />
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
}: {
  form: PersonalInfoForm;
  type: "sender" | "receiver";
}) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Address Details</CardTitle>
        <CardDescription>Enter details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddressForm form={form} type={type} />
      </CardContent>
    </Card>
  );
};

const Details = ({
  form,
  type,
}: {
  form: PersonalInfoForm;
  type: "sender" | "receiver";
}) => {
  return (
    <>
      <div className="space-y-6">
        <H2 className="capitalize">{type}</H2>
        <div className="flex space-x-6">
          {/* contact */}
          <ContactForm form={form} type={type} />
          {/* address */}
          <DeliveryForm form={form} type={type} />
        </div>
      </div>
    </>
  );
};

const EditParcel = ({ parcel }: { parcel: Parcel }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: updateParcel } = api.parcels.update.useMutation();
  const router = useRouter();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      sender: {
        address: {
          id: parcel.origin.id,
          street: parcel.origin.street,
          city: parcel.origin.city,
          postalCode: parcel.origin.postalCode,
          country: parcel.origin.country,
        },
        contact: {
          id: parcel.senderContact.id,
          fullName: parcel.senderContact.fullName ?? undefined,
          phone: parcel.senderContact.phone,
          email: parcel.senderContact.email,
        },
      },
      receiver: {
        address: {
          id: parcel.destination.id,
          street: parcel.destination.street,
          city: parcel.destination.city,
          postalCode: parcel.destination.postalCode,
          country: parcel.destination.country,
        },
        contact: {
          id: parcel.receiverContact.id,
          fullName: parcel.receiverContact.fullName ?? undefined,
          phone: parcel.receiverContact.phone,
          email: parcel.receiverContact.email,
        },
      },
    },
  });

  const handleSubmit = async (data: PersonalInfoFormValues) => {
    setLoading(true);

    try {
      await updateParcel({ id: parcel.id, ...data });
      toast.success("User updated");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Update User&apos;s Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex space-x-6">
              <Details form={form} type="sender" />
              <Details form={form} type="receiver" />
            </div>

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="submit" variant="secondary">
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParcel;

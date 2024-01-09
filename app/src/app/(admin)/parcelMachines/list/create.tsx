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
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { zodResolver } from "@hookform/resolvers/zod";
import { LockerSize } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addressSchema } from "~/helpers/dbSchemas";
import { api } from "~/trpc/react";

const updateSchema = z.object({
  name: z.string().min(1, "Parcel machine name in required").max(255),
  address: addressSchema,
  [LockerSize.SMALL]: z.number().min(0).max(100),
  [LockerSize.MEDIUM]: z.number().min(0).max(100),
  [LockerSize.LARGE]: z.number().min(0).max(100),
  [LockerSize.XLARGE]: z.number().min(0).max(100),
});

const CreateParcelMachine = () => {
  const { mutateAsync: createParcelMachine } =
    api.parcelMachines.create.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: undefined,
      address: {
        street: undefined,
        city: undefined,
        postalCode: undefined,
        country: undefined,
      },
      [LockerSize.SMALL]: 0,
      [LockerSize.MEDIUM]: 0,
      [LockerSize.LARGE]: 0,
      [LockerSize.XLARGE]: 0,
    },
  });

  const handleSubmit = async (data: z.infer<typeof updateSchema>) => {
    setLoading(true);
    try {
      await createParcelMachine(data);
      toast.success("Parcel machine created");
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
        <Button disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Create a parcel machine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Parcel Machine name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      placeholder="Enter parcel Machine name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lockers</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  {Object.values(LockerSize).map((size) => (
                    <FormField
                      key={size}
                      control={form.control}
                      name={size}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{size}</FormLabel>
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
                  ))}
                </CardContent>
              </Card>
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle>Address Details</CardTitle>
                  <CardDescription>Enter details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter street"
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
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter city"
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
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter postal code"
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
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter country"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="submit" variant="secondary">
                  Update
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateParcelMachine;

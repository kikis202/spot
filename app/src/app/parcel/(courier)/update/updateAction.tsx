"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParcelStatus } from "@prisma/client";
import { CaretSortIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ParcelStatusUI } from "~/helpers/enumTranslations";
import { api } from "~/trpc/react";

const updateSchema = z.object({
  status: z.nativeEnum(ParcelStatus),
  title: z.string().min(1, "Add update title").max(255),
});

const UpdateAction = ({ parcelIds }: { parcelIds: string[] }) => {
  const { mutateAsync: updateParcels } =
    api.parcels.updateStatuses.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: ParcelStatus.IN_TRANSIT,
      title: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof updateSchema>) => {
    setLoading(true);
    try {
      await updateParcels({ parcelIds, ...data });
      toast.success("Parcels picked up");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const statusOptions = Object.entries(ParcelStatus).map(([_, value]) => ({
    label: ParcelStatusUI[value as ParcelStatus],
    value: value as ParcelStatus,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={loading || parcelIds.length === 0}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Parcels</DialogTitle>
          <DialogDescription>
            Update status and add a note to the selected parcels
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Update title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      placeholder="Enter update title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Status</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-52 justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? statusOptions.find(
                                (option) => option.value === field.value,
                              )?.label
                            : "Select status"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search for status..."
                          className="h-9"
                        />
                        <CommandEmpty>No matching status found.</CommandEmpty>
                        <CommandGroup className="max-h-52 overflow-y-scroll">
                          {statusOptions.map((option) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() =>
                                field.onChange(
                                  field.value === option.value
                                    ? undefined
                                    : option.value,
                                )
                              }
                            >
                              {option.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  option.value === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default UpdateAction;

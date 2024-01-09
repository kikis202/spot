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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { CaretSortIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

const manageUserSchema = z.object({
  role: z.nativeEnum(Role),
});

const ManageUser = ({ id, role }: { id: string; role: Role }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: updateUser } = api.users.update.useMutation();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(manageUserSchema),
    defaultValues: {
      role: role,
    },
  });

  const handleSubmit = async (data: z.infer<typeof manageUserSchema>) => {
    setLoading(true);

    try {
      await updateUser({ id, role: data.role });
      toast.success("User updated");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const roleOptions = Object.entries(Role).map(([_, value]) => ({
    value,
    label: value,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User&apos;s Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Role</FormLabel>
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
                            ? roleOptions.find(
                                (option) => option.value === field.value,
                              )?.label
                            : "Select user role"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search for role..."
                          className="h-9"
                        />
                        <CommandEmpty>No matching role found.</CommandEmpty>
                        <CommandGroup className="max-h-52 overflow-y-scroll">
                          {roleOptions.map((option) => (
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

export default ManageUser;

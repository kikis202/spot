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
import { Role } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { UsersListProps } from "./page";

const filterSchema = z.object({
  email: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});

type FilterInput = z.infer<typeof filterSchema>;

const defaultValues: FilterInput = {
  email: undefined,
  role: undefined,
};

const TableFilter = ({ searchParams }: UsersListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<FilterInput>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  useEffect(() => {
    try {
      form.reset(
        filterSchema.parse({
          email: searchParams.email,
          role: searchParams.role as Role,
        }),
      );
    } catch (error) {
      form.reset(defaultValues);
    }
  }, [form, searchParams]);

  const createQueryString = useCallback(
    (newValues: FilterInput) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newValues).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  const onSubmit = (data: FilterInput) => {
    router.push(pathname + "?" + createQueryString(data));
  };

  const roleOptions = Object.entries(Role).map(([_, value]) => ({
    label: value,
    value: value,
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4 space-y-2 md:flex-row md:items-center md:gap-6 md:space-y-0"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Tracking Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="text"
                  placeholder="Enter tracking number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        <Button type="submit" className="md:self-end">
          Filter
        </Button>
        <Button
          type="button"
          variant="outline"
          className="md:self-end"
          onClick={() => {
            onSubmit(defaultValues);
          }}
        >
          Reset
        </Button>
      </form>
    </Form>
  );
};

export default TableFilter;

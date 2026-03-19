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
import { ParcelSize, ParcelStatus } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ParcelSizeUI, ParcelStatusUI } from "~/helpers/enumTranslations";

import type { RouterOutputs } from "~/trpc/shared";
import type { TrackParcelProps } from "../(user)/own/page";

const filterSchema = z.object({
  trackingNumber: z.string().optional(),
  status: z.nativeEnum(ParcelStatus).optional(),
  size: z.nativeEnum(ParcelSize).optional(),
  originId: z.string().optional(),
  destinationId: z.string().optional(),
});

type FilterInput = z.infer<typeof filterSchema>;
type LocationOption =
  RouterOutputs["parcels"]["getMyFilterLocations"]["origins"][number];

type TableFilterProps = {
  originLocations: LocationOption[];
  destinationLocations: LocationOption[];
};

const defaultValues: FilterInput = {
  trackingNumber: undefined,
  status: undefined,
  size: undefined,
  originId: undefined,
  destinationId: undefined,
};

const TableFilter = ({
  searchParams,
  originLocations,
  destinationLocations,
}: TrackParcelProps & TableFilterProps) => {
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
          trackingNumber: searchParams.trackingNumber,
          status: searchParams.status,
          size: searchParams.size,
          originId: searchParams.originId,
          destinationId: searchParams.destinationId,
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

  const statusOptions = Object.entries(ParcelStatus).map(([_, value]) => ({
    label: ParcelStatusUI[value as ParcelStatus],
    value: value as ParcelStatus,
  }));
  const sizeOptions = Object.entries(ParcelSize).map(([_, value]) => ({
    label: ParcelSizeUI[value as ParcelSize],
    value: value as ParcelSize,
  }));
  const originOptions = originLocations.map((location) => ({
    ids: location.ids,
    label: location.label,
    value: location.id,
  }));
  const destinationOptions = destinationLocations.map((location) => ({
    ids: location.ids,
    label: location.label,
    value: location.id,
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4 space-y-2 md:flex-row md:items-center md:gap-6 md:space-y-0"
      >
        <FormField
          control={form.control}
          name={`trackingNumber`}
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
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Size</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-44 justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? sizeOptions.find(
                            (option) => option.value === field.value,
                          )?.label
                        : "Select size"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for size..."
                      className="h-9"
                    />
                    <CommandEmpty>No matching size found.</CommandEmpty>
                    <CommandGroup className="max-h-52 overflow-y-scroll">
                      {sizeOptions.map((option) => (
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
        <FormField
          control={form.control}
          name="originId"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Origin</FormLabel>
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
                        ? originOptions.find(
                            (option) =>
                              field.value !== undefined &&
                              option.ids.includes(field.value),
                          )?.label
                        : "Select origin"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for origin..."
                      className="h-9"
                    />
                    <CommandEmpty>No matching origin found.</CommandEmpty>
                    <CommandGroup className="max-h-52 overflow-y-scroll">
                      {originOptions.map((option) => (
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
        <FormField
          control={form.control}
          name="destinationId"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Destination</FormLabel>
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
                        ? destinationOptions.find(
                            (option) =>
                              field.value !== undefined &&
                              option.ids.includes(field.value),
                          )?.label
                        : "Select destination"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for destination..."
                      className="h-9"
                    />
                    <CommandEmpty>No matching destination found.</CommandEmpty>
                    <CommandGroup className="max-h-52 overflow-y-scroll">
                      {destinationOptions.map((option) => (
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

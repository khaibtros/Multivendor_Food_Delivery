import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const OpeningHoursSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "openingHours",
  });

  const convertTimeStringToDate = (timeString: string) => {
    if (!timeString) return null;
    return parse(timeString, "HH:mm", new Date());
  };

  const convertDateToTimeString = (date: Date | null) => {
    if (!date) return "";
    return format(date, "HH:mm");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Opening Hours</h2>
        <p className="text-muted-foreground">
          Set your restaurant's opening hours for each day
        </p>
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <FormField
                control={control}
                name={`openingHours.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`openingHours.${index}.open`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Time</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={convertTimeStringToDate(field.value)}
                        onChange={(newValue) => {
                          field.onChange(convertDateToTimeString(newValue));
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "white",
                                borderRadius: "0.375rem",
                                "& fieldset": {
                                  borderColor: "rgb(226, 232, 240)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgb(148, 163, 184)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "rgb(59, 130, 246)",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`openingHours.${index}.close`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Time</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={convertTimeStringToDate(field.value)}
                        onChange={(newValue) => {
                          field.onChange(convertDateToTimeString(newValue));
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "white",
                                borderRadius: "0.375rem",
                                "& fieldset": {
                                  borderColor: "rgb(226, 232, 240)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgb(148, 163, 184)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "rgb(59, 130, 246)",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mb-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ day: "", open: "", close: "" })}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Opening Hours
          </Button>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default OpeningHoursSection; 
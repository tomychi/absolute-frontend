import { useState } from "react";
import { Clock, Copy, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import type { BusinessHours, DayHours } from "../../../types/branch.types";
import { DEFAULT_BUSINESS_HOURS } from "../../../types/branch.types";
import Button from "../../ui/Button";

interface BusinessHoursEditorProps {
  value: BusinessHours;
  onChange: (hours: BusinessHours) => void;
  className?: string;
}

const BusinessHoursEditor = ({
  value,
  onChange,
  className,
}: BusinessHoursEditorProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ];

  const updateDayHours = (dayKey: string, hours: DayHours) => {
    onChange({
      ...value,
      [dayKey]: hours,
    });
  };

  const copyHoursToAllDays = (sourceDay: string) => {
    const sourceHours = value[sourceDay as keyof BusinessHours];
    const updatedHours = { ...value };

    days.forEach((day) => {
      if (day.key !== sourceDay) {
        updatedHours[day.key as keyof BusinessHours] = { ...sourceHours };
      }
    });

    onChange(updatedHours);
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_BUSINESS_HOURS);
  };

  const toggleDayClosed = (dayKey: string) => {
    const currentHours = value[dayKey as keyof BusinessHours];
    updateDayHours(dayKey, {
      ...currentHours,
      closed: !currentHours.closed,
    });
  };

  const formatTimeDisplay = (hours: DayHours) => {
    if (hours.closed) return "Closed";
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Business Hours
          </h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          leftIcon={<RotateCcw className="h-3 w-3" />}
        >
          Reset to Default
        </Button>
      </div>

      {/* Days list */}
      <div className="space-y-2">
        {days.map((day) => {
          const hours = value[day.key as keyof BusinessHours];
          const isSelected = selectedDay === day.key;

          return (
            <div key={day.key}>
              {/* Day row */}
              <div
                className={clsx(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
                onClick={() => setSelectedDay(isSelected ? null : day.key)}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900 dark:text-white w-20">
                    {day.label}
                  </span>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={() => toggleDayClosed(day.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Open
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      hours.closed
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-white",
                    )}
                  >
                    {formatTimeDisplay(hours)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyHoursToAllDays(day.key);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    title={`Copy ${day.label}'s hours to all days`}
                    disabled={hours.closed}
                  >
                    <Copy className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Expanded time controls */}
              {isSelected && !hours.closed && (
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          updateDayHours(day.key, {
                            ...hours,
                            open: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          updateDayHours(day.key, {
                            ...hours,
                            close: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateDayHours(day.key, {
                          ...hours,
                          open: "09:00",
                          close: "17:00",
                        })
                      }
                    >
                      9 AM - 5 PM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateDayHours(day.key, {
                          ...hours,
                          open: "08:00",
                          close: "18:00",
                        })
                      }
                    >
                      8 AM - 6 PM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateDayHours(day.key, {
                          ...hours,
                          open: "10:00",
                          close: "22:00",
                        })
                      }
                    >
                      10 AM - 10 PM
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Summary
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {days.map((day) => {
            const hours = value[day.key as keyof BusinessHours];
            return (
              <div key={day.key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {day.short}:
                </span>
                <span
                  className={clsx(
                    "font-medium",
                    hours.closed
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400",
                  )}
                >
                  {formatTimeDisplay(hours)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursEditor;

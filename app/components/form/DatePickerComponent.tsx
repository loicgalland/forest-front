import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface props {
  label: string;
  olderDate: Date | null;
  onDateChange: (date: Date | null) => void;
  blockedDates?: Date[];
}

export const DatePickerComponent: React.FC<props> = ({
  label,
  olderDate,
  onDateChange,
  blockedDates,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isDateBlocked = (date: Date) => {
    if (blockedDates) {
      return blockedDates.some((blockedDate) => {
        return (
          date.getFullYear() === blockedDate.getFullYear() &&
          date.getMonth() === blockedDate.getMonth() &&
          date.getDate() === blockedDate.getDate()
        );
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log(date);
    onDateChange(date);
  };

  return (
    <div className="w-full mb-4">
      <span className="block mb-2">{label}</span>
      <DatePicker
        selected={olderDate ? olderDate : selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        filterDate={(date) => !isDateBlocked(date)}
        isClearable
        placeholderText="Choisissez une date"
        className="w-full rounded-md bg-beige text-text placeholder:text-text placeholder:opacity-50 px-2 py-1 shadow-sm font-bold placeholder:font-light"
      />
    </div>
  );
};

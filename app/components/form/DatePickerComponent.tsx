import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface props {
  label: string;
  olderDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const DatePickerComponent: React.FC<props> = ({
  label,
  olderDate,
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blockedDate) => {
      return (
        date.getFullYear() === blockedDate.getFullYear() &&
        date.getMonth() === blockedDate.getMonth() &&
        date.getDate() === blockedDate.getDate()
      );
    });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="w-full">
      <span className="block">{label}</span>
      <div className="relative w-full">
        <DatePicker
          selected={olderDate ? olderDate : selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          filterDate={(date) => !isDateBlocked(date)}
          isClearable
          placeholderText="Choisissez une date"
          className="w-full rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
        />
        <span className="absolute top-[50%] right-2 transform translate-y-[-50%] text-text">
          <i className="fa-regular fa-calendar"></i>
        </span>
      </div>
    </div>
  );
};

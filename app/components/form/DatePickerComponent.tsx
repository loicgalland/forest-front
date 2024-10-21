import React, { useEffect, useState } from "react";
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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div>
      <span className="block">{label}</span>
      <DatePicker
        selected={olderDate ? olderDate : selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        isClearable
        placeholderText="Choisissez une date"
      />
    </div>
  );
};

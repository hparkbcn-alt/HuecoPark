"use client"
import React from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
  value: Range;
  onChange: (fieldName: string, value: Range) => void;
  disabledDates?: Date[];
  startTime?: string;
  endTime?: string;
  onTimeChange?: (field: 'startTime' | 'endTime', value: string) => void;
  occupiedHours?: string[];
}

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  disabledDates,
  startTime = '09:00',
  endTime = '10:00',
  onTimeChange,
  occupiedHours = [],
}) => {
  const handleChange = (value: RangeKeyDict) => {
    onChange("dateRange", value.selection)
  }

  const timeOptions = generateTimeOptions();
  
  // Filtrar opciones de tiempo disponibles
  const isTimeOccupied = (time: string) => {
    return occupiedHours.includes(time);
  };

  return (
    <div>
      <DateRange
        rangeColors={["#10b981"]}
        ranges={[value]}
        date={new Date()}
        onChange={handleChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
      />
      
      {onTimeChange && (
        <div className="px-4 pb-4 space-y-3">
          {occupiedHours.length > 0 && (
            <div className="border-t pt-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm text-yellow-800">
                <div className="font-medium mb-1">⚠️ Horas ocupadas en esta fecha:</div>
                <div className="text-xs">
                  {occupiedHours.length} hora{occupiedHours.length !== 1 ? 's' : ''} no disponible{occupiedHours.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
          
          <div className={occupiedHours.length > 0 ? "" : "border-t pt-3"}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de inicio
            </label>
            <select
              value={startTime}
              onChange={(e) => onTimeChange('startTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {timeOptions.map((time) => {
                const occupied = isTimeOccupied(time);
                return (
                  <option 
                    key={`start-${time}`} 
                    value={time}
                    disabled={occupied}
                    style={{ 
                      backgroundColor: occupied ? '#fee' : 'white',
                      color: occupied ? '#999' : 'black'
                    }}
                  >
                    {time} {occupied ? '(Ocupado)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de fin
            </label>
            <select
              value={endTime}
              onChange={(e) => onTimeChange('endTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {timeOptions.map((time) => {
                const occupied = isTimeOccupied(time);
                return (
                  <option 
                    key={`end-${time}`} 
                    value={time}
                    disabled={occupied}
                    style={{ 
                      backgroundColor: occupied ? '#fee' : 'white',
                      color: occupied ? '#999' : 'black'
                    }}
                  >
                    {time} {occupied ? '(Ocupado)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-800">
            <div className="font-medium">Horario seleccionado:</div>
            <div>{startTime} - {endTime}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

import React from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";

import Button from "@/components/Button";
import SpinnerMini from "@/components/Loader";
import { formatPrice } from "@/utils/helper";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (name: string, value: Range) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabledDates: Date[];
  startTime?: string;
  endTime?: string;
  onTimeChange?: (field: 'startTime' | 'endTime', value: string) => void;
  totalHours?: number;
  occupiedHours?: string[];
}

const Calendar = dynamic(() => import("@/components/Calender"), {
  ssr: false
})

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabledDates,
  isLoading,
  startTime,
  endTime,
  onTimeChange,
  totalHours,
  occupiedHours,
}) => {
  // Validar si las fechas están correctamente seleccionadas
  const isDateValid = dateRange.startDate && dateRange.endDate && 
    dateRange.startDate.getTime() !== dateRange.endDate.getTime() || 
    (dateRange.startDate?.getTime() === dateRange.endDate?.getTime() && startTime !== endTime);
  
  // Validar si hay conflictos de horario
  const hasTimeConflict = React.useMemo(() => {
    if (!occupiedHours || occupiedHours.length === 0 || !startTime || !endTime) {
      return false;
    }
    
    // Verificar si la hora de inicio o fin está ocupada
    if (occupiedHours.includes(startTime) || occupiedHours.includes(endTime)) {
      return true;
    }
    
    // Verificar si hay alguna hora ocupada en el rango seleccionado
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTimeNum = startHour + startMinute / 60;
    const endTimeNum = endHour + endMinute / 60;
    
    return occupiedHours.some(occupiedTime => {
      const [occHour, occMin] = occupiedTime.split(':').map(Number);
      const occTimeNum = occHour + occMin / 60;
      return occTimeNum >= startTimeNum && occTimeNum < endTimeNum;
    });
  }, [occupiedHours, startTime, endTime]);
  
  const isButtonDisabled = isLoading || !isDateValid || hasTimeConflict;
  
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <span className="text-lg font-semibold">{formatPrice(price)}€</span>
        <span className="font-light text-neutral-600">hora</span>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={onChangeDate}
        startTime={startTime}
        endTime={endTime}
        onTimeChange={onTimeChange}
        occupiedHours={occupiedHours}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={isButtonDisabled}
          onClick={onSubmit}
          className="flex flex-row items-center justify-center h-[42px] "
          size="large"
        >
          {isLoading ? <SpinnerMini /> : <span>Reservar</span>}
        </Button>
        {!isDateValid && !isLoading && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Selecciona una fecha y horario para continuar
          </p>
        )}
        {isDateValid && hasTimeConflict && !isLoading && (
          <p className="text-xs text-red-500 text-center mt-2">
            ⚠️ El horario seleccionado tiene conflictos con reservas existentes
          </p>
        )}
      </div>
      <hr />
      <div className="p-4">
        {totalHours !== undefined && totalHours > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            {totalHours} hora{totalHours !== 1 ? 's' : ''} × {formatPrice(price)}€
          </div>
        )}
        <div className="flex flex-row items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}€</span>
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;

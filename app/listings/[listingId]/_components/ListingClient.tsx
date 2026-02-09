"use client";
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import { User } from "next-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ListingReservation from "./ListingReservation";
import { createPaymentSession, createReservation } from "@/services/reservation";
import ContactHostButton from "@/components/ContactHostButton";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: {
    startDate: Date;
    endDate: Date;
  }[];
  children: ReactNode;
  id: string;
  title: string;
  price: number;
  user:
    | (User & {
        id: string;
      })
    | undefined;
  owner?: {
    id: string;
    name: string | null;
  };
}

const ListingClient: React.FC<ListingClientProps> = ({
  price,
  reservations = [],
  children,
  user,
  id,
  title,
  owner,
}) => {
  const [totalPrice, setTotalPrice] = useState(price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [totalHours, setTotalHours] = useState(1);
  const [isLoading, startTransition] = useTransition();
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);
  const router = useRouter();
  
  // Calcular días completamente ocupados (24 horas)
  const disabledDates = useMemo(() => {
    const dateOccupancy = new Map<string, number>();
    
    reservations.forEach((reservation) => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      
      // Calcular horas ocupadas para cada día
      const daysInRange = eachDayOfInterval({ start, end });
      
      daysInRange.forEach((day) => {
        const dayKey = day.toISOString().split('T')[0];
        
        // Si es el primer día, calcular desde la hora de inicio hasta medianoche
        // Si es el último día, calcular desde medianoche hasta la hora de fin
        // Si es un día intermedio, son 24 horas completas
        
        let hoursOccupied = 0;
        const isSameDay = start.toDateString() === end.toDateString();
        const isFirstDay = day.toDateString() === start.toDateString();
        const isLastDay = day.toDateString() === end.toDateString();
        
        if (isSameDay) {
          // Reserva en el mismo día
          const startHour = start.getHours() + start.getMinutes() / 60;
          const endHour = end.getHours() + end.getMinutes() / 60;
          hoursOccupied = endHour - startHour;
        } else if (isFirstDay) {
          // Primer día: desde hora inicio hasta medianoche
          const startHour = start.getHours() + start.getMinutes() / 60;
          hoursOccupied = 24 - startHour;
        } else if (isLastDay) {
          // Último día: desde medianoche hasta hora fin
          const endHour = end.getHours() + end.getMinutes() / 60;
          hoursOccupied = endHour;
        } else {
          // Días intermedios: 24 horas completas
          hoursOccupied = 24;
        }
        
        dateOccupancy.set(
          dayKey,
          (dateOccupancy.get(dayKey) || 0) + hoursOccupied
        );
      });
    });
    
    // Solo deshabilitar días con 24 horas ocupadas
    const fullyOccupiedDates: Date[] = [];
    dateOccupancy.forEach((hours, dateKey) => {
      if (hours >= 24) {
        fullyOccupiedDates.push(new Date(dateKey));
      }
    });
    
    return fullyOccupiedDates;
  }, [reservations]);
  
  // Calcular horas ocupadas para la fecha seleccionada
  useEffect(() => {
    if (!dateRange.startDate) {
      setOccupiedHours([]);
      return;
    }
    
    const selectedDate = dateRange.startDate;
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const occupied: string[] = [];
    
    reservations.forEach((reservation) => {
      const resStart = new Date(reservation.startDate);
      const resEnd = new Date(reservation.endDate);
      const resStartDate = resStart.toISOString().split('T')[0];
      const resEndDate = resEnd.toISOString().split('T')[0];
      
      // Verificar si la reserva afecta la fecha seleccionada
      if (selectedDateStr >= resStartDate && selectedDateStr <= resEndDate) {
        // Determinar el rango de horas ocupadas
        let startHour = 0;
        let endHour = 24;
        
        const isSameDay = resStartDate === resEndDate;
        
        if (isSameDay && selectedDateStr === resStartDate) {
          // Reserva en el mismo día que la fecha seleccionada
          startHour = resStart.getHours();
          const startMinute = resStart.getMinutes();
          endHour = resEnd.getHours();
          const endMinute = resEnd.getMinutes();
          
          // Generar horas ocupadas en intervalos de 30 min
          for (let h = startHour; h <= endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
              const currentTime = h + m / 60;
              const startTime = startHour + startMinute / 60;
              const endTime = endHour + endMinute / 60;
              
              if (currentTime >= startTime && currentTime < endTime) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                if (!occupied.includes(timeStr)) {
                  occupied.push(timeStr);
                }
              }
            }
          }
        } else if (selectedDateStr === resStartDate) {
          // Primer día de una reserva multi-día
          startHour = resStart.getHours();
          const startMinute = resStart.getMinutes();
          
          for (let h = startHour; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
              const currentTime = h + m / 60;
              const startTime = startHour + startMinute / 60;
              
              if (currentTime >= startTime) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                if (!occupied.includes(timeStr)) {
                  occupied.push(timeStr);
                }
              }
            }
          }
        } else if (selectedDateStr === resEndDate) {
          // Último día de una reserva multi-día
          endHour = resEnd.getHours();
          const endMinute = resEnd.getMinutes();
          
          for (let h = 0; h <= endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
              const currentTime = h + m / 60;
              const endTime = endHour + endMinute / 60;
              
              if (currentTime < endTime) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                if (!occupied.includes(timeStr)) {
                  occupied.push(timeStr);
                }
              }
            }
          }
        } else {
          // Día intermedio: todas las horas ocupadas
          for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
              const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
              if (!occupied.includes(timeStr)) {
                occupied.push(timeStr);
              }
            }
          }
        }
      }
    });
    
    setOccupiedHours(occupied);
  }, [dateRange.startDate, reservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      // Si es el mismo día, calcular por horas
      if (dayCount === 0) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        const diffMinutes = endMinutes - startMinutes;
        const hours = Math.max(0.5, diffMinutes / 60); // Mínimo 0.5 horas
        
        setTotalHours(hours);
        setTotalPrice(Math.round(hours * price * 100) / 100);
      } else {
        // Múltiples días: calcular por días completos
        const totalDays = dayCount + 1;
        setTotalHours(totalDays * 24);
        setTotalPrice(totalDays * 24 * price);
      }
    }
  }, [dateRange.endDate, dateRange.startDate, price, startTime, endTime]);

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    if (field === 'startTime') {
      setStartTime(value);
      // Si la hora de fin es menor que la de inicio, ajustarla
      const [startHour, startMinute] = value.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      if (endHour * 60 + endMinute <= startHour * 60 + startMinute) {
        // Agregar 1 hora a la hora de inicio
        const newEndHour = startHour + 1;
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        setEndTime(newEndTime);
      }
    } else {
      setEndTime(value);
    }
  };

  const onCreateReservation = () => {
    if (!user) return toast.error("Por favor inicia sesión para reservar.");
    
    // Validar que no se esté reservando en horas ocupadas
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Verificar si las horas seleccionadas están ocupadas
    const startTimeStr = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    if (occupiedHours.includes(startTimeStr) || occupiedHours.includes(endTimeStr)) {
      return toast.error("Las horas seleccionadas ya están ocupadas. Por favor elige otro horario.");
    }
    
    // Verificar si hay alguna hora ocupada en el rango seleccionado
    const hasConflict = occupiedHours.some(occupiedTime => {
      const [occHour, occMin] = occupiedTime.split(':').map(Number);
      const occTime = occHour + occMin / 60;
      const startTimeNum = startHour + startMinute / 60;
      const endTimeNum = endHour + endMinute / 60;
      
      return occTime >= startTimeNum && occTime < endTimeNum;
    });
    
    if (hasConflict) {
      return toast.error("El horario seleccionado tiene conflictos con reservas existentes. Por favor elige otro horario.");
    }
    
    startTransition(async () => {
      try {
        const { endDate, startDate } = dateRange;
        
        if (!startDate || !endDate) {
          toast.error("Por favor selecciona las fechas");
          return;
        }

        // Combinar fecha con hora seleccionada
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);
        
        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        // Validar que la hora de fin sea posterior a la de inicio
        if (endDateTime <= startDateTime) {
          toast.error("La hora de fin debe ser posterior a la de inicio");
          return;
        }
        
        const res = await createPaymentSession({
          listingId: id,
          endDate: endDateTime,
          startDate: startDateTime,
          totalPrice,
        });

        if(res?.url){
          router.push(res.url);
        }
      } catch (error: any) {
        toast.error(error?.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
      {children}

      <div className="order-first mb-10 md:order-last md:col-span-3">
        {owner && user?.id !== owner.id && (
          <ContactHostButton
            listingId={id}
            listingTitle={title}
            hostId={owner.id}
            hostName={owner.name || "Anfitrión"}
          />
        )}
        <ListingReservation
          price={price}
          totalPrice={totalPrice}
          onChangeDate={(name, value) => setDateRange(value)}
          dateRange={dateRange}
          onSubmit={onCreateReservation}
          isLoading={isLoading}
          disabledDates={disabledDates}
          startTime={startTime}
          endTime={endTime}
          onTimeChange={handleTimeChange}
          totalHours={totalHours}
          occupiedHours={occupiedHours}
        />
      </div>
    </div>
  );
};

export default ListingClient;

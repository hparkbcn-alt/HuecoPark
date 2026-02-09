"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { formatISO } from "date-fns";

import Modal from "./Modal";
import Button from "../Button";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";

const Calendar = dynamic(() => import("@/components/Calender"), { ssr: false });

const steps = {
  "0": "location",
  "1": "dateRange",
};

enum STEPS {
  LOCATION = 0,
  DATE = 1,
}

const SearchModal = ({ onCloseModal }: { onCloseModal?: () => void }) => {
  const [step, setStep] = useState(STEPS.LOCATION);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { handleSubmit, setValue, watch, getValues } = useForm<FieldValues>({
    defaultValues: {
      location: null,
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    },
  });

  const location = watch("location");
  const dateRange = watch("dateRange");
  const country = location?.label;

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [country]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.DATE) return onNext();
    const { dateRange } = data;

    let currentQuery = {};

    if (searchParams) {
      currentQuery = queryString.parse(searchParams.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      zone: location?.label,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    onCloseModal?.();
    router.push(url);
  };

  const body = () => {
    switch (step) {
      case STEPS.DATE:
        return (
          <div className="flex flex-col gap-3">
            <Heading
              title="¿Cuándo necesitas estacionar?"
              subtitle="Selecciona las fechas de reserva"
            />
            <div className="h-[348px] w-full">
              <Calendar onChange={setCustomValue} value={dateRange} />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col gap-4">
            <Heading
              title="¿En qué zona de Barcelona necesitas parking?"
              subtitle="Busca por barrio, calle o zona específica"
            />
            <CountrySelect value={location} onChange={setCustomValue} />
            
            {location && location.popularStreets && location.popularStreets.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium mb-1">
                  📍 Calles principales en {location.label}:
                </p>
                <p className="text-sm text-green-700">
                  {location.popularStreets.join(" • ")}
                </p>
              </div>
            )}
            
            <div className="h-[240px]">
              <Map center={location?.latlng} />
            </div>
          </div>
        );
    }
  };

  const isFieldFilled = !!getValues(steps[step]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      <Modal.WindowHeader title="Filtrar" />
      <form
        className="h-auto flex-1 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative p-6">{body()}</div>
        <div className="flex flex-col gap-2 px-6 pb-6 pt-3">
          <div className="flex flex-row items-center gap-4 w-full">
            {step !== STEPS.LOCATION ? (
              <Button
                type="button"
                className="flex items-center gap-2 justify-center"
                onClick={onBack}
                outline
              >
                Atrás
              </Button>
            ) : null}
            <Button
              type="submit"
              className="flex items-center gap-2 justify-center"
              disabled={!isFieldFilled}
            >
              {step === STEPS.DATE ? "Buscar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchModal;

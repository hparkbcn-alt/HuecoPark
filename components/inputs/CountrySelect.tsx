"use client";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import barcelonaLocations from "@/data/barcelona-locations.json";

export type CountrySelectValue = {
  label: string;
  latlng: number[];
  region: string;
  value: string;
  type: string;
  popularStreets?: string[];
};

const CountrySelect = ({
  value,
  onChange,
}: {
  value?: CountrySelectValue;
  onChange: (name: string, val: CountrySelectValue) => void;
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (value: CountrySelectValue) => {
    onChange("location", value);
  };

  return (
    <div className="space-y-2">
      <Select
        ref={ref}
        placeholder="Selecciona barrio, calle o zona de Barcelona..."
        isClearable
        options={barcelonaLocations}
        value={value}
        onChange={handleChange}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-col gap-1 z-[10]">
            <div className="flex items-center gap-2">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                {option.type}
              </span>
            </div>
            <div className="text-xs text-neutral-500">
              {option.region}
              {option.popularStreets && option.popularStreets.length > 0 && (
                <span className="ml-2">• {option.popularStreets.slice(0, 2).join(", ")}</span>
              )}
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-[6px] text-[14px] border-1",
          input: () => "text-[14px]",
          option: () => "text-[14px] py-2",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "#10b981",
            primary25: "#d1fae5",
          },
        })}
      />
      <p className="text-xs text-neutral-500 px-1">
        💡 Busca por barrio (Eixample, Gràcia...), calle (Diagonal, Rambla...) o zona específica
      </p>
    </div>
  );
};

export default CountrySelect;

"use client";
import React, { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiDollar } from "react-icons/bi";

import Modal from "./Modal";
import Button from "../Button";
import SpinnerMini from "../Loader";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import Input from "../inputs/Input";
import CategoryButton from "../inputs/CategoryButton";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../ImageUpload";

import { categories } from "@/utils/constants";
import { createListing } from "@/services/listing";

const steps = {
  "0": "category",
  "1": "location",
  "2": "capacity",
  "3": "image",
  "4": "title",
  "5": "price",
};

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = ({ onCloseModal }: { onCloseModal?: () => void }) => {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "Cubierto",
      location: null,
      capacity: 50,
      levelCount: 2,
      image: "",
      price: "",
      title: "",
      description: "",
    },
  });

  const location = watch("location");
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
    if (step !== STEPS.PRICE) return onNext();

    startTransition(async () => {
      try {
        const newListing = await createListing(data);
        toast.success(`${data.title} added successfully!`);
        queryClient.invalidateQueries({
          queryKey: ["listings"],
        });
        reset();
        setStep(STEPS.CATEGORY);
        onCloseModal?.();
        router.refresh();
        router.push(`/listings/${newListing.id}`);
      } catch (error: any) {
        toast.error("Failed to create listing!");
        console.log(error?.message)
      }
    });
  };

  const body = () => {
    switch (step) {
      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="¿En qué zona de Barcelona está tu parking?"
              subtitle="Selecciona el barrio, calle o zona específica"
            />
            <CountrySelect value={location} onChange={setCustomValue} />
            
            {location && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Dirección específica (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carrer de Balmes, 123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => setCustomValue("specificAddress", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  {location.popularStreets && location.popularStreets.length > 0 && (
                    <>📍 Calles populares: {location.popularStreets.join(", ")}</>
                  )}
                </p>
              </div>
            )}
            
            <div className="h-[240px]">
              <Map center={location?.latlng} />
            </div>
          </div>
        );

      case STEPS.INFO:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Capacidad del parking"
              subtitle="¿Cuántos vehículos pueden estacionar?"
            />
            <Counter
              title="Capacidad Total"
              subtitle="Número de espacios disponibles"
              watch={watch}
              onChange={setCustomValue}
              name="capacity"
            />
          </div>
        );

      case STEPS.IMAGES:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Agrega una foto de tu parking"
              subtitle="Muestra cómo es tu estacionamiento"
            />
            <ImageUpload
              onChange={setCustomValue}
              initialImage={getValues("image")}
            />
          </div>
        );

      case STEPS.DESCRIPTION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="¿Cómo describirías tu estacionamiento?"
              subtitle="Breve y claro funciona mejor"
            />
            <Input
              id="title"
              label="Título"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
              autoFocus
            />
            <hr />
            <Input
              id="description"
              label="Descripción"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
          </div>
        );

      case STEPS.PRICE:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Establece tu tarifa"
              subtitle="¿Cuánto cobras por hora?"
            />
            <Input
              key="price"
              id="price"
              label="Precio por hora"
              icon={BiDollar}
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
              autoFocus
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col gap-2">
            <Heading
              title="¿Qué tipo de estacionamiento tienes?"
              subtitle="Selecciona una categoría"
            />
            <div className="flex-1 grid grid-cols-2  gap-3 max-h-[60vh] lg:max-h-[260px] overflow-y-scroll scroll-smooth">
              {categories.map((item) => (
                  <CategoryButton
                    onClick={setCustomValue}
                    watch={watch}
                    label={item.label}
                    icon={item.icon}
                    key={item.label}
                  />
              ))}
            </div>
          </div>
        );
    }
  };

  const isFieldFilled = !!getValues(steps[step]);

  return (
    <div className="w-full h-full flex flex-col">
      <Modal.WindowHeader title="¡Publica tu parking!" />
      <form
        className="flex-1  md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative p-6">{body()}</div>
        <div className="flex flex-col gap-2 px-6 pb-6 pt-3">
          <div className="flex flex-row items-center gap-4 w-full">
            {step !== STEPS.CATEGORY ? (
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
              disabled={isLoading || !isFieldFilled}
            >
              {isLoading ? (
                <SpinnerMini />
              ) : step === STEPS.PRICE ? (
                "Crear"
              ) : (
                "Siguiente"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RentModal;

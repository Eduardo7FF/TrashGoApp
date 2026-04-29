import React, {
  createContext,
  useContext,
  useState,
} from "react";

type DriverContextType = {
  vehiculo: any;
  setVehiculo: (v: any) => void;

  ruta: any;
  setRuta: (r: any) => void;

  recorridoActivo: boolean;
  setRecorridoActivo: (v: boolean) => void;

  recorridoId: string | null;
  setRecorridoId: (id: string | null) => void;

  horaInicio: string | null;
  setHoraInicio: (v: string | null) => void;

  horaFin: string | null;
  setHoraFin: (v: string | null) => void;
};

const DriverContext = createContext<DriverContextType>(
  {} as DriverContextType
);

export function DriverProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [ruta, setRuta] = useState<any>(null);

  const [recorridoActivo, setRecorridoActivo] =
    useState(false);

  const [recorridoId, setRecorridoId] =
    useState<string | null>(null);

  const [horaInicio, setHoraInicio] =
    useState<string | null>(null);

  const [horaFin, setHoraFin] =
    useState<string | null>(null);

  return (
    <DriverContext.Provider
      value={{
        vehiculo,
        setVehiculo,

        ruta,
        setRuta,

        recorridoActivo,
        setRecorridoActivo,

        recorridoId,
        setRecorridoId,

        horaInicio,
        setHoraInicio,

        horaFin,
        setHoraFin,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  return useContext(DriverContext);
}
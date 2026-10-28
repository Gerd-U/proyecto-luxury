export type Motivo = "informacion" | "disponibilidad";

export interface ContactForm {
  nombre: string;
  correo: string;
  telefono: string;
  propiedad: string;
  motivo: Motivo;
  mensaje: string;
}

export const MOTIVO_LABEL: Record<Motivo, string> = {
  informacion: "Pedir información",
  disponibilidad: "Disponibilidad de fechas",
};

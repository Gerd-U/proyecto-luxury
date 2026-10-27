export type Motivo = "visita" | "informacion" | "disponibilidad";

export type Horario = "" | "manana" | "tarde";

export interface ContactForm {
  nombre: string;
  correo: string;
  telefono: string;
  propiedad: string;
  motivo: Motivo;
  fecha: string;
  horario: Horario;
  mensaje: string;
}

export const MOTIVO_LABEL: Record<Motivo, string> = {
  visita: "Agendar visita",
  informacion: "Pedir información",
  disponibilidad: "Disponibilidad de fechas",
};

export const HORARIO_LABEL: Record<Exclude<Horario, "">, string> = {
  manana: "Mañana (8 a. m. – 12 m.)",
  tarde: "Tarde (1 p. m. – 5 p. m.)",
};

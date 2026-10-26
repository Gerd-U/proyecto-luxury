/** Un enlace a una página del sitio (lo usa el footer con NavLink). */
export interface FooterLink {
  to: string;
  label: string;
}

/** Redes que tienen ícono propio en SocialIcon. */
export type SocialNetwork = "instagram" | "facebook" | "whatsapp" | "email";

/** Un enlace a una red social (o al correo) con su ícono. */
export interface SocialLink {
  network: SocialNetwork;
  /** Nombre que leen los lectores de pantalla, por ejemplo "Instagram". */
  label: string;
  href: string;
}

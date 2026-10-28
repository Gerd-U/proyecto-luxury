export interface FooterLink {
  to: string;
  label: string;
}

export type SocialNetwork = "instagram" | "facebook" | "whatsapp" | "email";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  href: string;
}

import type { SocialNetwork } from "../../types/footer";

interface SocialIconProps {
  network: SocialNetwork;
  size?: number;
  className?: string;
}

function SocialIcon({ network, size = 22, className = "" }: SocialIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {network === "instagram" && (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </>
      )}

      {network === "facebook" && (
        <path d="M15.5 3.5h-2a4 4 0 0 0-4 4v3H7v3.5h2.5v6.5H13V14h2.5l.5-3.5h-3V8.5a1 1 0 0 1 1-1h1.5Z" />
      )}

      {network === "whatsapp" && (
        <>
          <path d="M20 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.7A8.2 8.2 0 1 1 20 11.7Z" />
          <path d="M9.3 8.7c.2-.4.5-.5.8-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6a5.6 5.6 0 0 0 2.2 2.2l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3-.1.6-.5.8-.5.4-1.3.5-2 .3a6.8 6.8 0 0 1-4.6-4.6c-.2-.7 0-1.5.2-2.1Z" />
        </>
      )}

      {network === "email" && (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m4.5 7 7.5 5.5L19.5 7" />
        </>
      )}
    </svg>
  );
}

export default SocialIcon;

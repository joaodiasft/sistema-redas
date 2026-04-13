const DEFAULT_PHONE = "5562981899570";

export function getWhatsAppPhone(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? DEFAULT_PHONE;
  return raw.replace(/\D/g, "") || DEFAULT_PHONE.replace(/\D/g, "");
}

export function whatsAppLink(text: string): string {
  const phone = getWhatsAppPhone();
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

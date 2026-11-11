import {
  Beer,
  Car,
  Coffee,
  Croissant,
  Dumbbell,
  Flower2,
  Hamburger,
  IceCreamCone,
  PawPrint,
  Pizza,
  Scissors,
  Shirt,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/** Sellos que un negocio puede elegir. La clave es lo que se guarda en la base de datos. */
export const STAMPS: Record<string, { label: string; Icon: LucideIcon }> = {
  coffee: { label: "Café", Icon: Coffee },
  croissant: { label: "Panadería", Icon: Croissant },
  burger: { label: "Hamburguesas", Icon: Hamburger },
  pizza: { label: "Pizza", Icon: Pizza },
  utensils: { label: "Restaurante", Icon: Utensils },
  icecream: { label: "Heladería", Icon: IceCreamCone },
  beer: { label: "Bar", Icon: Beer },
  scissors: { label: "Barbería", Icon: Scissors },
  sparkles: { label: "Belleza", Icon: Sparkles },
  flower: { label: "Floristería", Icon: Flower2 },
  shirt: { label: "Lavandería", Icon: Shirt },
  paw: { label: "Mascotas", Icon: PawPrint },
  dumbbell: { label: "Gimnasio", Icon: Dumbbell },
  car: { label: "Autolavado", Icon: Car },
};

export function StampIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const { Icon } = STAMPS[name] ?? STAMPS.coffee;
  return <Icon aria-hidden size={size} strokeWidth={1.75} className={className} />;
}

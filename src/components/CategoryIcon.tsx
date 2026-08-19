import {
  Settings, Package, UtensilsCrossed, Building2, Zap,
  Armchair, CircleDot, Layers, Wheat, Boxes, type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Settings': Settings,
  'Package': Package,
  'UtensilsCrossed': UtensilsCrossed,
  'Building2': Building2,
  'Zap': Zap,
  'Armchair': Armchair,
  'CircleDot': CircleDot,
  'Layers': Layers,
  'Wheat': Wheat,
  'Boxes': Boxes,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Boxes;
  return <Icon className={className} />;
}

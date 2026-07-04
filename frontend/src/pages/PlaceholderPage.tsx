import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <Construction className="w-16 h-16 text-gray-300 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p>This section is currently under construction.</p>
    </div>
  );
}

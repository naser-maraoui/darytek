"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../actions";

const statuses = [
  { value: "pending", label: "En attente", color: "orange" },
  { value: "confirmed", label: "Confirmée", color: "blue" },
  { value: "processing", label: "En préparation", color: "purple" },
  { value: "shipped", label: "Expédiée", color: "indigo" },
  { value: "delivered", label: "Livrée", color: "green" },
  { value: "cancelled", label: "Annulée", color: "red" },
] as const;

const colorClasses: Record<string, { active: string; idle: string }> = {
  orange: {
    active: "bg-orange-500 text-white shadow-md shadow-orange-500/25",
    idle: "bg-orange-50 text-orange-700 hover:bg-orange-100 ring-1 ring-orange-200",
  },
  blue: {
    active: "bg-orange-500 text-white shadow-md shadow-blue-600/25",
    idle: "bg-orange-50 text-orange-700 hover:bg-orange-100 ring-1 ring-blue-200",
  },
  purple: {
    active: "bg-purple-600 text-white shadow-md shadow-purple-600/25",
    idle: "bg-purple-50 text-purple-700 hover:bg-purple-100 ring-1 ring-purple-200",
  },
  indigo: {
    active: "bg-indigo-600 text-white shadow-md shadow-indigo-600/25",
    idle: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-1 ring-indigo-200",
  },
  green: {
    active: "bg-green-600 text-white shadow-md shadow-green-600/25",
    idle: "bg-green-50 text-green-700 hover:bg-green-100 ring-1 ring-green-200",
  },
  red: {
    active: "bg-red-600 text-white shadow-md shadow-red-600/25",
    idle: "bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-red-200",
  },
};

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export default function StatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loadingValue, setLoadingValue] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(newStatus: string) {
    if (newStatus === status || loadingValue) return;

    const confirmed = window.confirm(
      `Changer le statut vers "${getLabel(newStatus)}" ?`
    );
    if (!confirmed) return;

    setLoadingValue(newStatus);
    setError("");
    setSuccess(false);

    const result = await updateOrderStatus(orderId, newStatus);

    if (!result.success) {
      setError(result.error || "Une erreur est survenue.");
      setLoadingValue(null);
      return;
    }

    setStatus(newStatus);
    setSuccess(true);
    router.refresh();

    setTimeout(() => setSuccess(false), 3000);
    setLoadingValue(null);
  }

  return (
    <div>
      {/* Status grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {statuses.map((item) => {
          const active = item.value === status;
          const isLoading = loadingValue === item.value;
          const colors = colorClasses[item.color];

          return (
            <button
              key={item.value}
              type="button"
              disabled={loadingValue !== null}
              onClick={() => handleChange(item.value)}
              className={`relative flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                active ? colors.active : colors.idle
              }`}
            >
              {isLoading ? (
                <Spinner />
              ) : active ? (
                <CheckIcon />
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          <CheckIcon />
          Statut mis à jour avec succès.
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <AlertIcon />
          {error}
        </div>
      )}

      {!success && !error && (
        <p className="mt-4 text-xs text-gray-400">
          Le client peut suivre l&apos;avancement via la page &quot;Suivre ma
          commande&quot;.
        </p>
      )}
    </div>
  );
}

function getLabel(value: string) {
  return statuses.find((item) => item.value === value)?.label || value;
}
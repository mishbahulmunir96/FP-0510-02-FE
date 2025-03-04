import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-lg shadow-sm ${
              levelUp
                ? "bg-gradient-to-br from-green-50 to-green-100 text-green-600"
                : levelDown
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600"
                  : "bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-500"
            }`}
          >
            {children}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-2xl font-bold text-gray-900">
              {total}
            </h4>
            <span className="block truncate text-sm font-medium text-gray-500">
              {title}
            </span>
          </div>
        </div>

        <span
          className={`ml-2 flex w-full shrink-0 items-center justify-end gap-1 text-sm font-medium ${
            levelUp
              ? "text-green-600"
              : levelDown
                ? "text-blue-600"
                : "text-gray-600"
          }`}
        >
          {rate}

          {levelUp && (
            <svg
              className="h-4 w-4 fill-green-600"
              viewBox="0 0 10 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" />
            </svg>
          )}
          {levelDown && (
            <svg
              className="h-4 w-4 fill-blue-600"
              viewBox="0 0 10 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;

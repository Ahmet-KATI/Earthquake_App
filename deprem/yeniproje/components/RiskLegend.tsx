"use client";

import React from "react";

interface RiskLegendProps {
    className?: string;
}

const RISK_ITEMS = [
    { degree: 1, color: "#DC2626", label: "1. Derece - En Yüksek Risk" },
    { degree: 2, color: "#FB923C", label: "2. Derece - Yüksek Risk" },
    { degree: 3, color: "#FDE047", label: "3. Derece - Orta Risk" },
    { degree: 4, color: "#FEF9C3", label: "4. Derece - Düşük-Orta Risk" },
    { degree: 5, color: "#D1FAE5", label: "5. Derece - En Düşük Risk" },
];

export default function RiskLegend({ className = "" }: RiskLegendProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div
            className={`absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
            style={{ minWidth: "200px" }}
        >
            <div
                className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Deprem Risk Haritası
                </h3>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {isCollapsed ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    )}
                </button>
            </div>

            {!isCollapsed && (
                <div className="px-4 py-3 space-y-2">
                    {RISK_ITEMS.map((item) => (
                        <div key={item.degree} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                {item.label}
                            </span>
                        </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                            AFAD/DASK verilerine dayalı sınıflandırma
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

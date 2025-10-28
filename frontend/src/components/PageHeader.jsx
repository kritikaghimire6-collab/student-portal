// frontend/src/components/PageHeader.jsx
import React from "react";

/**
 * Style D (College Banner) header for inner pages.
 * Usage:
 *   <PageHeader
 *     title="Dashboard"
 *     subtitle="Welcome back! Here’s what’s happening today."
 *   />
 */
export default function PageHeader({ title, subtitle, right }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {right /* optional: place buttons/filters here */}
      </div>
    </header>
  );
}

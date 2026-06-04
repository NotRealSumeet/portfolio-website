import React from 'react';

/**
 * Reusable utility to format currency values beautifully.
 * Separates the currency symbol and styles it slightly smaller and muted.
 */
export function formatPrice(priceStr: string, isBig: boolean = false): React.ReactElement {
  if (priceStr === 'Custom Pricing') {
    return (
      <span className={isBig ? "text-2xl sm:text-3xl font-black text-white tracking-tight" : "text-sm font-semibold text-white"}>
        Custom Pricing
      </span>
    );
  }

  // Split by range separators
  const parts = priceStr.split(/[–-]/);

  const renderPart = (part: string) => {
    const trimmed = part.trim();
    // Search for currency symbols anywhere in the string
    const symbolMatch = trimmed.match(/[\$₹]/);
    if (!symbolMatch) {
      return (
        <span className={isBig ? "text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight" : "text-sm font-semibold text-white"}>
          {trimmed}
        </span>
      );
    }

    const symbol = symbolMatch[0];
    const symbolIndex = symbolMatch.index ?? 0;
    const prefix = trimmed.substring(0, symbolIndex);
    const number = trimmed.substring(symbolIndex + 1).trim();

    return (
      <span className="inline-flex items-baseline">
        {prefix && (
          <span className={`text-zinc-500 font-sans font-light mr-1 select-none ${
            isBig ? 'text-xs sm:text-sm' : 'text-[10px]'
          }`}>
            {prefix}
          </span>
        )}
        <span className={`font-sans font-light text-zinc-500 mr-0.5 select-none ${
          isBig ? 'text-base sm:text-lg lg:text-xl' : 'text-[10px] sm:text-xs'
        }`}>
          {symbol}
        </span>
        <span className={`font-sans text-white tracking-tight ${
          isBig ? 'text-2xl sm:text-3xl lg:text-4xl font-black' : 'text-sm sm:text-base font-bold'
        }`}>
          {number}
        </span>
      </span>
    );
  };

  if (parts.length === 2) {
    return (
      <span className="inline-flex items-baseline flex-wrap">
        {renderPart(parts[0])}
        <span className="text-zinc-600 font-sans font-light mx-2 select-none">—</span>
        {renderPart(parts[1])}
      </span>
    );
  }

  return renderPart(priceStr);
}

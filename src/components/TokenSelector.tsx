import { useState, useMemo } from "react";
import { clsx } from "clsx";
import { X, Search } from "lucide-react";
import type { Token } from "../lib/api";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onSelect: (tokenId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  chain: string | null;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  isOpen,
  onClose,
  chain,
}: TokenSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = tokens;
    if (chain) {
      list = list.filter((t) => t.chain === chain);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tokens, chain, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="bg-[var(--tg-theme-secondary-bg-color,#1e293b)] rounded-t-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold">Select Token</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tg-theme-hint-color,#94a3b8)]" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500 text-[var(--tg-theme-text-color,#f8fafc)] placeholder:text-[var(--tg-theme-hint-color,#94a3b8)]"
            />
          </div>
        </div>
        <div className="overflow-y-auto px-4 pb-4 flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-[var(--tg-theme-hint-color,#94a3b8)] py-8">
              No tokens found
            </p>
          ) : (
            filtered.map((token) => (
              <button
                key={token.id}
                onClick={() => {
                  onSelect(token.id);
                  onClose();
                  setSearch("");
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all active:scale-[0.98]",
                  selectedToken === token.id
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "hover:bg-white/5"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                  {token.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{token.symbol}</p>
                  <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
                    {token.name}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

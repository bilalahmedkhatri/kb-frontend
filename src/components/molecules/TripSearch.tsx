"use client";

import { useState, useRef, useEffect } from "react";
import { cn, formatDate } from "@/src/lib/utils";
import { Button } from "@/src/components/atoms/Button";
import {
  HiMapPin,
  HiCalendarDays,
  HiUser,
  HiMagnifyingGlass,
} from "react-icons/hi2";

interface TripSearchProps {
  onSearch?: (query: { where: string; checkIn: string; checkOut: string; guests: number }) => void;
  className?: string;
}

export function TripSearch({ onSearch, className }: TripSearchProps) {
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch?.({ where, checkIn, checkOut, guests });
  };

  const dateLabel = checkIn
    ? checkOut
      ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
      : formatDate(checkIn)
    : "When";

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-[#DDDDDD] sm:bg-white sm:shadow-sm sm:ring-1 sm:ring-[#DDDDDD] sm:divide-x sm:divide-[#DDDDDD]">
        <div className="flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-5 py-3 sm:border-0 sm:bg-transparent sm:flex-1">
          <HiMapPin className="h-4 w-4 shrink-0 text-[#FF385C]" />
          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-transparent text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none"
          />
        </div>

        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex w-full items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-5 py-3 text-sm sm:border-0 sm:bg-transparent"
          >
            <HiCalendarDays className="h-4 w-4 shrink-0 text-[#FF385C]" />
            <span className={cn(checkIn ? "text-[#222222]" : "text-[#717171]")}>{dateLabel}</span>
          </button>
          {showCalendar && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-[#DDDDDD] bg-white p-4 shadow-lg sm:left-auto sm:w-72">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#717171]">Check in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] [color-scheme:light]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#717171]">Check out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] [color-scheme:light]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-5 py-3 sm:border-0 sm:bg-transparent">
          <HiUser className="h-4 w-4 shrink-0 text-[#FF385C]" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#DDDDDD] text-xs text-[#717171] hover:border-[#222222] hover:text-[#222222]"
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium text-[#222222]">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests(Math.min(16, guests + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#DDDDDD] text-xs text-[#717171] hover:border-[#222222] hover:text-[#222222]"
            >
              +
            </button>
          </div>
        </div>

        <div className="sm:pl-2 sm:pr-2">
          <Button
            size="sm"
            className="w-full h-11 rounded-full sm:h-10 sm:w-10 sm:rounded-full sm:p-0"
            onClick={handleSearch}
            aria-label="Search"
          >
            <HiMagnifyingGlass className="h-4 w-4" />
            <span className="sm:hidden">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

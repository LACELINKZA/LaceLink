"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Listing = {
  id: string;
  vendor_id: string;
  title: string;
  description: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
};

type ListingImage = {
  id: string;
  image_url: string;
  sort_order: number;
  created_at?: string;
};

function dollarsToCents(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) r

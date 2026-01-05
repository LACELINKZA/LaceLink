"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VendorProfilePage() {
  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please sign in");
      return;
    }

    const { error } = await supabase.from("vendors").upsert({
      id: user.id,
      store_name: storeName,
      bio,
      email: user.email,
    });

    if (error) setStatus(error.message);
    else setStatus("Profile saved ✅");
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Vendor Profile</h1>

      <input
        placeholder="Store name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      />

      <textarea
        placeholder="Store bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button onClick={saveProfile}>Save</button>
      <p>{status}</p>
    </main>
  );
}

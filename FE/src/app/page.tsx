"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { Button } from "antd";

export default function HomePage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.replace("/login");
    } else {
      router.replace("/products");
    }
  }, [auth?.user, router]);

  return null; // hoặc loading spinner
}

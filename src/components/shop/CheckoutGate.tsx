"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GateModal from "@/components/shop/GateModal";
import { useShopGate } from "@/components/shop/useShopGate";

/**
 * همان قفل و پیام فروشگاه، برای مرحله تکمیل خرید.
 * اگر در پنل فعال باشد، تا رمز مخفی تایپ نشود، فرم تسویه باز نمی‌شود.
 */
export default function CheckoutGate() {
  const { gate, locked } = useShopGate("checkout", true);

  // قفل اسکرول صفحه پشت پاپ‌آپ
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  return <AnimatePresence>{locked && <GateModal gate={gate} />}</AnimatePresence>;
}

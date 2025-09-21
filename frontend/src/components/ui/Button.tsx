import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost"|"danger" };
export default function Button({ className, variant="primary", ...props }: Props) {
  const base = "rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black";
  const styles = variant === "primary"
    ? "bg-black text-white hover:opacity-90 active:opacity-80 dark:bg-white dark:text-black"
    : variant === "danger"
    ? "bg-red-600 text-white hover:brightness-110"
    : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10";
  return <motion.button whileTap={{ scale: 0.98 }} className={twMerge(base, styles, className)} {...props} />;
}


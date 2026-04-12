import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto max-w-md px-4 pb-24 pt-16"
    >
      {children}
    </motion.main>
    <BottomNav />
  </div>
);

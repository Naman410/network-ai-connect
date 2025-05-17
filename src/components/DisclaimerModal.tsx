
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

export default function DisclaimerModal({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl glass max-w-md w-full border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">About & Data Disclaimer</DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300 text-sm">
            Intro data comes from publicly shared Discord <em>#introductions</em>.<br />
            Want your info removed? Email&nbsp;
            <a href="mailto:namkej@gmail.com" className="underline text-accent1">namkej@gmail.com</a>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button
              className="mt-4 px-5 py-2 bg-grayui dark:bg-slate-700 rounded-lg font-medium hover:scale-[1.02] transition-transform"
            >
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

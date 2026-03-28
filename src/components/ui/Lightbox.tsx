"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { PortfolioProject } from "@/data/portfolio"

interface LightboxProps {
  projects: PortfolioProject[]
  currentIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ projects, currentIndex, onClose, onNavigate }: LightboxProps) {
  const isOpen = currentIndex !== null

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || currentIndex === null) return
    switch (e.key) {
      case "Escape":
        onClose()
        break
      case "ArrowRight":
        onNavigate(Math.min(currentIndex + 1, projects.length - 1))
        break
      case "ArrowLeft":
        onNavigate(Math.max(currentIndex - 1, 0))
        break
    }
  }, [isOpen, currentIndex, projects.length, onClose, onNavigate])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && currentIndex !== null && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[5000] bg-brand-black/95 backdrop-blur-sm flex items-center justify-center cursor-none"
          onClick={onClose}
        >
          <motion.div
            key={`lightbox-content-${currentIndex}`}
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl w-full mx-6 lg:mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Project visual placeholder */}
            <div
              className="w-full aspect-[16/9] rounded-sm overflow-hidden relative"
              style={{ background: projects[currentIndex].color }}
            >
              {/* Category label overlay */}
              <div className="absolute top-6 left-6">
                <span className="font-body text-xs tracking-[0.2em] uppercase text-brand-cream/70 border border-brand-cream/20 px-3 py-1">
                  {projects[currentIndex].category}
                </span>
              </div>
            </div>

            {/* Info bar */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="font-body text-brand-muted text-xs tracking-[0.2em] uppercase mb-2">
                  {projects[currentIndex].client}
                </p>
                <h3 className="font-display text-2xl lg:text-3xl text-brand-cream leading-tight">
                  {projects[currentIndex].title}
                </h3>
                <p className="font-body text-brand-muted text-sm mt-3 max-w-xl leading-relaxed">
                  {projects[currentIndex].description}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {projects[currentIndex].tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-xs text-brand-muted/70 border border-brand-muted/20 px-2 py-0.5 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => onNavigate(Math.max(currentIndex - 1, 0))}
                  disabled={currentIndex === 0}
                  aria-label="Projet précédent"
                  className="w-10 h-10 border border-brand-cream/20 text-brand-cream/60 hover:text-brand-cream hover:border-brand-cream/50 disabled:opacity-25 transition-colors duration-200 flex items-center justify-center"
                >
                  ←
                </button>
                <span className="font-body text-brand-muted text-sm tabular-nums">
                  {currentIndex + 1} / {projects.length}
                </span>
                <button
                  onClick={() => onNavigate(Math.min(currentIndex + 1, projects.length - 1))}
                  disabled={currentIndex === projects.length - 1}
                  aria-label="Projet suivant"
                  className="w-10 h-10 border border-brand-cream/20 text-brand-cream/60 hover:text-brand-cream hover:border-brand-cream/50 disabled:opacity-25 transition-colors duration-200 flex items-center justify-center"
                >
                  →
                </button>
                <button
                  onClick={onClose}
                  aria-label="Fermer"
                  className="w-10 h-10 border border-brand-cream/20 text-brand-cream/60 hover:text-brand-cream hover:border-brand-cream/50 transition-colors duration-200 flex items-center justify-center ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

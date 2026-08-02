import { create } from 'zustand'

interface FiltersUiState {
  isMobileDrawerOpen: boolean
  openMobileDrawer: () => void
  closeMobileDrawer: () => void
}

/** Point client UI-state only — filter values themselves live in the URL, not here. */
export const useFiltersUiStore = create<FiltersUiState>((set) => ({
  isMobileDrawerOpen: false,
  openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
}))

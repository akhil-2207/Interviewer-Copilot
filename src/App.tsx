import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/AppShell"
import { CandidatePage } from "@/pages/CandidatePage"
import { DashboardPage } from "@/pages/DashboardPage"
import { GuidePage } from "@/pages/GuidePage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/candidates/akhil-mathew" element={<CandidatePage />} />
        <Route path="/candidates/akhil-mathew/guide" element={<GuidePage />} />
        <Route path="/interviews" element={<PlaceholderPage />} />
        <Route path="/candidates" element={<PlaceholderPage />} />
        <Route path="/settings" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

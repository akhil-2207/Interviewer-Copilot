import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/AppShell"
import { CandidatePage } from "@/pages/CandidatePage"
import { DashboardPage } from "@/pages/DashboardPage"
import { GuidePage } from "@/pages/GuidePage"
import { GenerateGuidePage } from "@/pages/GenerateGuidePage"

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/candidates/akhil-mathew" element={<CandidatePage />} />
        <Route path="/generate" element={<GenerateGuidePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

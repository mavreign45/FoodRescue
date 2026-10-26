import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/components/ui/Toast";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingPage } from "@/pages/LandingPage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { FoodDetailsPage } from "@/pages/FoodDetailsPage";
import { ReservationTrackingPage } from "@/pages/ReservationTrackingPage";
import { ImpactPage } from "@/pages/ImpactPage";
import { DonorDashboardPage } from "@/pages/DonorDashboardPage";
import { OrganizationDashboardPage } from "@/pages/OrganizationDashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <ToastProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="food/:listingId" element={<FoodDetailsPage />} />
              <Route path="tracking/:requestId" element={<ReservationTrackingPage />} />
              <Route path="impact" element={<ImpactPage />} />
              <Route path="donor" element={<DonorDashboardPage />} />
              <Route path="organization" element={<OrganizationDashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

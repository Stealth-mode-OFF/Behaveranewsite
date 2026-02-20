import { Component, Suspense, lazy, type ErrorInfo, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { LanguageProvider } from "./contexts/language-context";
import { ModalProvider } from "./contexts/modal-context";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { ScrollProgress } from "./components/ui/scroll-progress";
import { ScrollToTop } from "./components/scroll-to-top";
import { CookieBanner } from "./components/layout/cookie-banner";
import { LandingPage } from "./pages/public/landing";
import { adminEnabled } from "@/lib/config";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BookingModal } from "./components/layout/booking-modal";
import { DemoAccessModal } from "./components/layout/demo-access-modal";
import { SignupModal } from "./components/layout/signup-modal";
import { LeadPopup } from "./components/layout/lead-popup";

const TermsPage = lazy(() =>
  import("./pages/public/terms").then((module) => ({ default: module.TermsPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import("./pages/public/privacy-policy").then((module) => ({ default: module.PrivacyPolicyPage }))
);
const NotFoundPage = lazy(() =>
  import("./pages/public/not-found").then((module) => ({ default: module.NotFoundPage }))
);
const ComparisonGoogleFormsPage = lazy(() =>
  import("./pages/public/comparison-google-forms").then((module) => ({ default: module.ComparisonGoogleFormsPage }))
);
const SolutionPage = lazy(() =>
  import("./pages/public/solution").then((module) => ({ default: module.SolutionPage }))
);
const NonprofitPage = lazy(() =>
  import("./pages/public/nonprofit").then((module) => ({ default: module.NonprofitPage }))
);

const AdminLayout = lazy(() =>
  import("./pages/admin/admin-layout").then((module) => ({ default: module.AdminLayout }))
);
const AdminLogin = lazy(() =>
  import("./pages/admin/admin-login").then((module) => ({ default: module.AdminLogin }))
);
const Dashboard = lazy(() =>
  import("./pages/admin/dashboard").then((module) => ({ default: module.Dashboard }))
);
const PostList = lazy(() =>
  import("./pages/admin/post-list").then((module) => ({ default: module.PostList }))
);
const PostEditor = lazy(() =>
  import("./pages/admin/post-editor").then((module) => ({ default: module.PostEditor }))
);
const CaseStudyList = lazy(() =>
  import("./pages/admin/case-study-list").then((module) => ({ default: module.CaseStudyList }))
);
const CaseStudyEditor = lazy(() =>
  import("./pages/admin/case-study-editor").then((module) => ({ default: module.CaseStudyEditor }))
);

// Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", fontFamily: "system-ui", backgroundColor: "#2E1065", color: "white", minHeight: "100vh" }}>
          <h1 style={{ color: "#ff6b6b" }}>Something went wrong</h1>
          <pre style={{ backgroundColor: "#3D1A7A", padding: "20px", borderRadius: "8px", overflow: "auto" }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <ModalProvider>
            <AuthProvider>
              <ScrollToTop />
              <ScrollProgress />
              <div className="min-h-screen bg-brand-background-primary font-sans text-brand-text-primary">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

                    <Route path="/blog" element={<Navigate to="/?scroll=blog" replace />} />
                    <Route path="/blog/:slug" element={<LegacyBlogRedirect />} />

                    <Route path="/case-studies" element={<Navigate to="/?scroll=case-studies" replace />} />
                    <Route path="/case-studies/:slug" element={<LegacyCaseStudyRedirect />} />
                    <Route path="/changelog" element={<Navigate to="/?scroll=blog" replace />} />
                    <Route path="/team" element={<Navigate to="/?scroll=about&open=about" replace />} />

                    {/* Comparison SEO landing pages */}
                    <Route path="/echo-pulse-vs-google-forms" element={<ComparisonGoogleFormsPage />} />

                    {/* Role-specific solution pages */}
                    <Route path="/for-ceos" element={<SolutionPage />} />
                    <Route path="/for-hr" element={<SolutionPage />} />
                    <Route path="/for-team-leads" element={<SolutionPage />} />

                    {/* Self-service Sign Up */}
                    <Route path="/start" element={<Navigate to="/?signup=1" replace />} />
                    <Route path="/signup" element={<Navigate to="/?signup=1" replace />} />

                    {/* Marketing short-links */}

                    {/* Nonprofit campaign — Givt × Behavera (no nav link) */}
                    <Route path="/pro-neziskovky" element={<NonprofitPage />} />

                    {/* Admin Routes */}
                    {adminEnabled ? (
                      <>
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<Dashboard />} />

                          <Route path="posts" element={<PostList />} />
                          <Route path="posts/new" element={<PostEditor />} />
                          <Route path="posts/edit/:id" element={<PostEditor />} />

                          <Route path="case-studies" element={<CaseStudyList />} />
                          <Route path="case-studies/new" element={<CaseStudyEditor />} />
                          <Route path="case-studies/edit/:id" element={<CaseStudyEditor />} />
                        </Route>
                      </>
                    ) : (
                      <Route path="/admin/*" element={<Navigate to="/" replace />} />
                    )}

                    {/* 404 Catch-all */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                <Toaster position="top-center" richColors />
                {/* Global modal layer so CTAs work from every route in one-page mode */}
                <BookingModal />
                <DemoAccessModal />
                <SignupModal />
                <LeadPopup />
                <CookieBanner />
                <Analytics />
                <SpeedInsights />
              </div>
            </AuthProvider>
          </ModalProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-sm text-brand-text-muted">
      Loading…
    </div>
  );
}

function LegacyBlogRedirect() {
  const { slug } = useParams();
  if (!slug) {
    return <Navigate to="/?scroll=blog" replace />;
  }
  return <Navigate to={`/?scroll=blog&post=${encodeURIComponent(slug)}`} replace />;
}

function LegacyCaseStudyRedirect() {
  const { slug } = useParams();
  if (!slug) {
    return <Navigate to="/?scroll=case-studies" replace />;
  }
  return <Navigate to={`/?scroll=case-studies&case=${encodeURIComponent(slug)}`} replace />;
}

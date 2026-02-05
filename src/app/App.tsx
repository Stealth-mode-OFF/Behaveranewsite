import React, { Component, ErrorInfo, ReactNode, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import { ModalProvider } from "./ModalContext";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { ScrollProgress } from "./components/ui/scroll-progress";
import { LandingPage } from "./pages/public/landing";
import { adminEnabled } from "@/lib/config";

const TermsPage = lazy(() =>
  import("./pages/public/terms").then((module) => ({ default: module.TermsPage }))
);
const BlogPage = lazy(() =>
  import("./pages/public/blog").then((module) => ({ default: module.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import("./pages/public/blog-post").then((module) => ({ default: module.BlogPostPage }))
);
const CaseStudiesPage = lazy(() =>
  import("./pages/public/case-studies").then((module) => ({ default: module.CaseStudiesPage }))
);
const CaseStudyPage = lazy(() =>
  import("./pages/public/case-study").then((module) => ({ default: module.CaseStudyPage }))
);
const ResearchPage = lazy(() =>
  import("./pages/public/research").then((module) => ({ default: module.ResearchPage }))
);

const AdminLayout = lazy(() =>
  import("./pages/admin/admin-layout").then((module) => ({ default: module.AdminLayout }))
);
const AdminLogin = lazy(() =>
  import("./pages/admin/admin-login").then((module) => ({ default: module.AdminLogin }))
);
const Dashboard = lazy(() =>
  import("./pages/admin/Dashboard").then((module) => ({ default: module.Dashboard }))
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
              <ScrollProgress />
              <div className="min-h-screen bg-brand-background-primary font-sans text-brand-text-primary">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />

                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
                    <Route path="/research" element={<ResearchPage />} />

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
                  </Routes>
                </Suspense>
                <Toaster position="top-center" richColors />
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

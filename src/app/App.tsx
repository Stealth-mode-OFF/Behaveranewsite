import React, { Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import { ModalProvider } from "./ModalContext";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { ScrollProgress } from "./components/ui/scroll-progress";
import { LandingPage } from "./pages/public/landing";
import { TermsPage } from "./pages/public/terms";

// Public Pages
import { BlogPage } from "./pages/public/blog";
import { BlogPostPage } from "./pages/public/blog-post";
import { CaseStudiesPage } from "./pages/public/case-studies";
import { CaseStudyPage } from "./pages/public/case-study";
import { ResearchPage } from "./pages/public/research";

// Admin Pages
import { AdminLayout } from "./pages/admin/admin-layout";
import { AdminLogin } from "./pages/admin/admin-login";
import { Dashboard } from "./pages/admin/dashboard";
import { PostList } from "./pages/admin/post-list";
import { PostEditor } from "./pages/admin/post-editor";
import { CaseStudyList } from "./pages/admin/case-study-list";
import { CaseStudyEditor } from "./pages/admin/case-study-editor";
import { adminEnabled } from "@/lib/config";

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

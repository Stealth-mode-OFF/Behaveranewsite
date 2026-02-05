import React, { Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import { ModalProvider } from "./ModalContext";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { LandingPage } from "./components/LandingPage";
import { TermsPage } from "./components/TermsPage";

// Public Pages
import { BlogPage } from "./pages/blog/BlogPage";
import { BlogPostPage } from "./pages/blog/BlogPostPage";
import { CaseStudiesPage } from "./pages/case-studies/CaseStudiesPage";
import { CaseStudyPage } from "./pages/case-studies/CaseStudyPage";
import { ResearchPage } from "./pages/research/ResearchPage";

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { PostList } from "./pages/admin/PostList";
import { PostEditor } from "./pages/admin/PostEditor";
import { CaseStudyList } from "./pages/admin/CaseStudyList";
import { CaseStudyEditor } from "./pages/admin/CaseStudyEditor";
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

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { PostList } from "./pages/admin/PostList";
import { PostEditor } from "./pages/admin/PostEditor";
import { CaseStudyList } from "./pages/admin/CaseStudyList";
import { CaseStudyEditor } from "./pages/admin/CaseStudyEditor";

function App() {
  return (
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

                {/* Admin Routes */}
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
              </Routes>
              <Toaster position="top-center" richColors />
            </div>
          </AuthProvider>
        </ModalProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Chat } from '@/pages/Chat';
import { NotImplemented } from '@/pages/NotImplemented';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/sign-up/*" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </div>
          } />
          <Route path="/sign-in/*" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
            </div>
          } />
          <Route path="/generate-image" element={
            <ProtectedRoute>
              <NotImplemented featureName="Generate Image" />
            </ProtectedRoute>
          } />
          <Route path="/generate-video" element={
            <ProtectedRoute>
              <NotImplemented featureName="Generate Video" />
            </ProtectedRoute>
          } />
          <Route path="/audio" element={
            <ProtectedRoute>
              <NotImplemented featureName="Audio" />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <NotImplemented featureName="Settings" />
            </ProtectedRoute>
          } />
          <Route path="/upgrade" element={
            <ProtectedRoute>
              <NotImplemented featureName="Upgrade to Pro" />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

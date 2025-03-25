import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./ui/AppLayout"
import ProtectedRoute from "./ui/ProtectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import PostEditor from "./pages/PostEditor"
import { Toaster } from "react-hot-toast"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"
import PageNotFound from "./pages/PageNotFound"




const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})

function App() {

  return (
    <div> 
      <QueryClientProvider client={queryClient}>
        {/* <GlobalStyles /> */}
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="post" element={<PostEditor />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Signup />} />
              <Route path="*" element={<PageNotFound />} />

          </Routes>
          <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App

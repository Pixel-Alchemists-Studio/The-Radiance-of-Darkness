import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";

// Pages
import Home from "@/pages/Home";
import MangaList from "@/pages/MangaList";
import Reader from "@/pages/Reader";
import Gallery from "@/pages/Gallery";
import Universe from "@/pages/Universe";
import Studio from "@/pages/Studio";
import Contact from "@/pages/Contact";
import Trailer from "@/pages/Trailer";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/trailer" component={Trailer} />
        <Route path="/manga" component={MangaList} />
        <Route path="/reader/:id" component={Reader} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/universe" component={Universe} />
        <Route path="/studio" component={Studio} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

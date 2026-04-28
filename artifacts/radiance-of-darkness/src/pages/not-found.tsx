import React from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-7xl font-display font-bold text-primary text-glow mb-4">404</h1>
          <h2 className="text-2xl font-display text-foreground mb-6">Il Vuoto ti ha inghiottito</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            La pagina che cerchi è stata consumata dalle ombre di Aethermoor. 
            Torna indietro prima che sia troppo tardi.
          </p>
          <Link href="/">
            <Button className="bg-primary text-black hover:bg-primary/90">
              Ritorna alla Luce
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

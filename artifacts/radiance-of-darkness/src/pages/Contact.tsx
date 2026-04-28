import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, GraduationCap, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t.contact.toastTitle,
        description: t.contact.success,
        className: "bg-card border-primary/50 text-foreground"
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <PageTransition className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 text-glow">{t.contact.title}</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-display text-white mb-6">{t.contact.circle}</h2>
            <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
              {t.contact.circleDesc}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-foreground font-display text-xl mb-1">Email</h4>
                  <p className="text-muted-foreground">pixelalchemists09@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-foreground font-display text-xl mb-1">Studio</h4>
                  <p className="text-muted-foreground">ITIS E. Fermi — Classe 4°B</p>
                  <p className="text-muted-foreground">Fuscaldo (CS), Italia</p>
                </div>
              </div>

              {/* IIS Cetraro school link */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <GraduationCap className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground font-display text-xl mb-2">IIS Cetraro</h4>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {t.contact.schoolDesc ?? "Pixel Alchemists nasce all'IIS Cetraro – ITIS E. Fermi di Fuscaldo."}
                  </p>
                  <a
                    href="https://www.iiscetraro.edu.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/50 bg-primary/10 text-primary font-display text-sm tracking-wider uppercase hover:bg-primary hover:text-black transition-all duration-300"
                  >
                    {t.contact.schoolBtn ?? 'Visita la Nostra Scuola'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card/50 p-8 rounded-2xl border border-border/50 glass-panel relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary/50 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary/50 rounded-br-xl pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">{t.contact.name}</Label>
                <Input 
                  id="name" 
                  required 
                  className="bg-background border-border/50 focus:border-primary focus:ring-primary/20 h-12" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">{t.contact.email}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="bg-background border-border/50 focus:border-primary focus:ring-primary/20 h-12" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-muted-foreground">{t.contact.message}</Label>
                <Textarea 
                  id="message" 
                  required 
                  className="bg-background border-border/50 focus:border-primary focus:ring-primary/20 min-h-[150px] resize-none" 
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-display uppercase tracking-wider"
              >
                {isSubmitting ? t.contact.sending : t.contact.send}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

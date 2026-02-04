import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useModal } from '../ModalContext';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { submitLead } from '../utils/lead';

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useModal();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    const result = await submitLead({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      companySize: data.companySize,
      source: "booking-modal"
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Odeslání se nepodařilo.");
      return;
    }

    setIsSuccess(true);
    toast.success("Odesláno!");
    
    setTimeout(() => {
      closeBooking();
      setTimeout(() => {
        setIsSuccess(false);
        setError(null);
        reset();
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={closeBooking}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border border-brand-border">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
        
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-brand-text-primary mb-2">{t.leadPopup.successTitle}</DialogTitle>
            <DialogDescription className="text-brand-text-secondary">{t.leadPopup.successMessage}</DialogDescription>
          </div>
        ) : (
          <div className="p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold text-brand-text-primary">{t.header.bookDemo}</DialogTitle>
              <DialogDescription className="text-brand-text-secondary">
                {t.hero.subtitle}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-brand-text-secondary">{t.forms.workEmail}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email", { required: true })}
                  className="h-10 border-brand-border focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-brand-text-secondary">{t.forms.phone}</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  {...register("phone", { required: true })}
                  className="h-10 border-brand-border focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-semibold text-brand-text-secondary">{t.calculator.sliders.companySize}</Label>
                <select 
                    {...register("companySize")}
                    className="flex h-10 w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                 >
                    <option value="1-15">1-15</option>
                    <option value="16-50">16-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-200">101-200</option>
                    <option value="200+">200+</option>
                 </select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold h-12 mt-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.forms.submit}
              </Button>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

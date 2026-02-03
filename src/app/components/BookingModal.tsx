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

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useModal();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Request sent!");
    
    setTimeout(() => {
      closeBooking();
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={closeBooking}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border border-slate-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
        
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">{t.leadPopup.successTitle}</DialogTitle>
            <DialogDescription className="text-slate-500">{t.leadPopup.successMessage}</DialogDescription>
          </div>
        ) : (
          <div className="p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold text-slate-900">{t.header.bookDemo}</DialogTitle>
              <DialogDescription className="text-slate-500">
                {t.hero.subtitle}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">{t.forms.firstName}</Label>
                  <Input 
                    id="firstName" 
                    {...register("firstName", { required: true })}
                    className="h-10 border-slate-200 focus:ring-indigo-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">{t.forms.lastName}</Label>
                  <Input 
                    id="lastName" 
                    {...register("lastName", { required: true })} 
                    className="h-10 border-slate-200 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">{t.forms.workEmail}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email", { required: true })}
                  className="h-10 border-slate-200 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-semibold text-slate-700">{t.calculator.sliders.companySize}</Label>
                <select 
                    {...register("companySize")}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                 >
                    <option value="1-50">1-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-1000">201-1000</option>
                    <option value="1000+">1000+</option>
                 </select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 mt-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.forms.submit}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

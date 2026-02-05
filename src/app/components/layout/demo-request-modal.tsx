import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useModal } from "@/app/ModalContext";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/LanguageContext";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { CheckCircle2, Loader2 } from "lucide-react";

type DemoRequestFormData = {
  email: string;
  phone: string;
  companySize: string;
  role: string;
};

export function DemoRequestModal() {
  const { t } = useLanguage();
  const { demoRequestOpen, closeDemoRequest } = useModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<DemoRequestFormData>({
    defaultValues: {
      companySize: "",
      role: "",
    },
  });

  const copy = t.demoRequest || {};
  const companySizes = copy.sizes ? Object.values(copy.sizes) : [];
  const roles = copy.roles ? Object.values(copy.roles) : [];
  const errorInvalidEmail = copy.errorInvalidEmail || "Please enter a valid email.";
  const errorInvalidPhone = copy.errorInvalidPhone || "Please enter a valid phone number.";
  const errorRequired = copy.errorRequired || "This field is required.";
  const errorGeneric = copy.errorGeneric || "Submission failed. Please try again.";

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsSubmitting(true);
    setError(null);

    const result = await submitLead({
      email: data.email,
      phone: data.phone,
      companySize: data.companySize,
      role: data.role,
      source: "demo-request",
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || errorGeneric);
      return;
    }

    setIsSuccess(true);
    reset();
  };

  return (
    <Dialog open={demoRequestOpen} onOpenChange={(open) => (!open ? closeDemoRequest() : undefined)}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-white border border-brand-border">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-brand-text-primary mb-2">
              {copy.successTitle}
            </DialogTitle>
            <DialogDescription className="text-brand-text-secondary">
              {copy.successMessage}
            </DialogDescription>
          </div>
        ) : (
          <div className="p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold text-brand-text-primary">
                {copy.title}
              </DialogTitle>
              <DialogDescription className="text-brand-text-secondary">
                {copy.subtitle}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label={copy.emailLabel}
                error={errors.email?.message}
                required
              >
                <Input
                  type="email"
                  autoComplete={autocompleteAttributes.email}
                  placeholder={copy.emailPlaceholder || "name@company.com"}
                  {...register("email", validationRules.workEmail)}
                />
              </FormField>

              <FormField
                label={copy.phoneLabel}
                error={errors.phone?.message}
                required
              >
                <Input
                  type="tel"
                  autoComplete={autocompleteAttributes.phone}
                  placeholder={copy.phonePlaceholder || "+420 777 123 456"}
                  {...register("phone", validationRules.czechPhone)}
                />
              </FormField>

              <FormField
                label={copy.sizeLabel}
                error={errors.companySize?.message || (errors.companySize ? errorRequired : undefined)}
                required
              >
                <Controller
                  control={control}
                  name="companySize"
                  rules={{ required: errorRequired }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={copy.companySizePlaceholder || "Select size"} />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size: string) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField
                label={copy.roleLabel}
                error={errors.role?.message || (errors.role ? errorRequired : undefined)}
                required
              >
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: errorRequired }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={copy.rolePlaceholder || "Select role"} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: string) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {copy.submit}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

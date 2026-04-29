'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const newsletterSchema = z.object({
  email: z.string().email('Masukkan alamat email yang valid'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const PERKS = [
  'Weekly promos & flash deals',
  'Info produk baru setiap minggu',
  'Exclusive offers khusus member',
];

export default function NewsletterSection() {
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: NewsletterFormValues) {
    // No backend endpoint yet — show success feedback and reset
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Terima kasih! ${values.email} telah didaftarkan.`);
    form.reset();
  }

  return (
    <section className="relative overflow-hidden py-16 bg-foreground">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary/8 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="text-white">
            <div className="text-5xl mb-5 select-none">📬</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Get Latest Promos &amp; Updates
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Subscribe ke newsletter kami dan jadilah yang pertama tahu soal
              promo, new arrivals, dan exclusive deals yang sayang untuk dilewatkan.
            </p>
            <ul className="flex flex-col gap-2.5">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h3 className="text-white font-semibold text-lg mb-1">Join Now</h3>
            <p className="text-white/50 text-sm mb-6">
              No spam. Unsubscribe kapan saja.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            id="newsletter-email"
                            type="email"
                            placeholder="Enter your email address"
                            autoComplete="email"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/15 h-11"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="shrink-0 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <p className="text-white/30 text-xs mt-4">
              Dengan subscribe, kamu setuju dengan Privacy Policy kami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

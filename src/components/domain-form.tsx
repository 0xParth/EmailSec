'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  domain: z.string().min(1, 'Domain is required.').refine(v => !v.startsWith('http'), 'Please enter a domain name, not a URL.'),
  dkimSelector: z.string().min(1, 'DKIM selector is required.'),
});

type DomainFormValues = z.infer<typeof formSchema>;

interface DomainFormProps {
  onAnalyze: (data: DomainFormValues) => void;
  isPending: boolean;
}

export function DomainForm({ onAnalyze, isPending }: DomainFormProps) {
  const form = useForm<DomainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: '',
      dkimSelector: 'default',
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onAnalyze)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                    <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                            <Input placeholder="example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="md:col-span-5">
                    <FormField
                        control={form.control}
                        name="dkimSelector"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>DKIM Selector</FormLabel>
                            <FormControl>
                            <Input placeholder="default" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="md:col-span-2">
                    <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isPending ? "Analyzing..." : "Analyze"}
                        {!isPending && <Search className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}

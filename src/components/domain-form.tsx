'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  domain: z.string().min(1, 'Domain is required.').refine(v => !v.startsWith('http'), 'Please enter a domain name, not a URL.'),
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
    },
  });

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardContent className="pt-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onAnalyze)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-10">
                    <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="example.com" {...field} className="h-12 text-base"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="md:col-span-2">
                    <Button type="submit" disabled={isPending} size="lg" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base">
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

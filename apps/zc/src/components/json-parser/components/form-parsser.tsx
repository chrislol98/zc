'use client';
import { FormJson, useJson } from '../core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Rate } from '@/components/rate';

const formSchema = z.object({
  rate: z.number().min(0).max(5),
});

interface FormParserProps {
  id: FormJson['id'];
}

export default function FormParser({ id }: FormParserProps) {
  const formJson = useJson(id);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="rate" className="block mb-1">
          Rate
        </label>
        <Controller
          name="rate"
          control={control}
          render={({ field }) => (
            <Rate value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.rate && (
          <p className="text-red-500 text-sm mt-1">{errors.rate.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}

"use client";

import React from "react"

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  time_limit: z.coerce.number().min(100),
  memory_limit: z.coerce.number().min(16),
  tags: z.string().transform((val) => val.split(",").map((s) => s.trim())),
  test_cases: z.array(z.object({
    input: z.string(),
    expected_output: z.string(),
    is_sample: z.boolean().default(false),
    points: z.coerce.number().default(10),
    order_index: z.number()
  })).min(1),
});

export function ProblemForm({
  initialData,
  onSubmit,
  isLoading
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      difficulty: "EASY",
      time_limit: 1000,
      memory_limit: 256,
      test_cases: [{ input: "", expected_output: "", is_sample: false, points: 10, order_index: 0 }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "test_cases",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control: form.control,
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Title</FormLabel>
                <FormControl><Input placeholder="Two Sum" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Markdown supported)</FormLabel>
              <FormControl><Textarea rows={6} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Limit, Memory Limit, and Tags inputs go here similar to title */}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Test Cases</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ input: "", expected_output: "", is_sample: false, points: 10, order_index: fields.length })}>
              <Plus className="mr-2 h-4 w-4" /> Add Test Case
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-bold">Case #{index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`test_cases.${index}.input`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Input</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`test_cases.${index}.expected_output`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Output</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Problem"}
        </Button>
      </form>
    </Form>
  );
}

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  ageRange: z.array(z.number()).length(2),
  distance: z.number().min(1).max(100),
  gender: z.array(z.string()).min(1),
  lookingFor: z.enum(['casual', 'relationship', 'friendship']),
  memePreferences: z.array(z.string()),
  musicGenres: z.array(z.string()),
});

interface PreferencesStepProps {
  data: any;
  onChange: (data: any) => void;
  onComplete: () => void;
  onBack: () => void;
}

const memeCategories = [
  'Dank', 'Wholesome', 'Gaming', 'Anime', 'Animals',
  'Sports', 'Politics', 'Science', 'Tech', 'Food',
];

const musicGenres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic',
  'Jazz', 'Classical', 'Country', 'Metal', 'Indie',
];

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  data,
  onChange,
  onComplete,
  onBack,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageRange: data.preferences?.ageRange || [18, 35],
      distance: data.preferences?.distance || 50,
      gender: data.preferences?.gender || [],
      lookingFor: data.preferences?.lookingFor || 'relationship',
      memePreferences: data.preferences?.memePreferences || [],
      musicGenres: data.preferences?.musicGenres || [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onChange({ preferences: values });
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ageRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Range</FormLabel>
              <FormControl>
                <Slider
                  min={18}
                  max={100}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>
                {field.value[0]} - {field.value[1]} years old
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Distance</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>{field.value} kilometers</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested In</FormLabel>
              <div className="flex flex-wrap gap-2">
                {['MALE', 'FEMALE', 'NON_BINARY'].map((gender) => (
                  <FormField
                    key={gender}
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(gender)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, gender]
                                : field.value?.filter((g) => g !== gender);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {gender.charAt(0) + gender.slice(1).toLowerCase().replace('_', ' ')}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lookingFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Looking For</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select what you're looking for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="casual">Casual Dating</SelectItem>
                  <SelectItem value="relationship">Relationship</SelectItem>
                  <SelectItem value="friendship">Friendship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memePreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meme Preferences</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {memeCategories.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name="memePreferences"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, category]
                                : field.value?.filter((c) => c !== category);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {category}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="musicGenres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Music Preferences</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {musicGenres.map((genre) => (
                  <FormField
                    key={genre}
                    control={form.control}
                    name="musicGenres"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(genre)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, genre]
                                : field.value?.filter((g) => g !== genre);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {genre}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Complete Profile</Button>
        </div>
      </form>
    </Form>
  );
};

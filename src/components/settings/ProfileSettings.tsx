import React, { useState } from 'react';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(500),
  age: z.number().min(18).max(100),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']),
  interests: z.array(z.string()).min(3).max(10),
  photos: z.array(z.string()).min(1).max(6),
  showAge: z.boolean(),
  showDistance: z.boolean(),
});

interface ProfileSettingsProps {
  initialData: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const interests = [
  'Memes', 'Music', 'Gaming', 'Art', 'Travel',
  'Food', 'Sports', 'Movies', 'Books', 'Technology',
  'Fashion', 'Photography', 'Dance', 'Fitness', 'Comedy',
  'Animals', 'Nature', 'Science', 'Politics', 'Anime'
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialData,
  onSave,
  saving,
}) => {
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      bio: initialData?.bio || '',
      age: initialData?.age || undefined,
      gender: initialData?.gender || undefined,
      interests: initialData?.interests || [],
      photos: photos,
      showAge: initialData?.showAge ?? true,
      showDistance: initialData?.showDistance ?? true,
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const newPhotos = await Promise.all(
      acceptedFiles.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const updatedPhotos = [...photos, ...newPhotos].slice(0, 6);
    setPhotos(updatedPhotos);
    form.setValue('photos', updatedPhotos);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 6 - photos.length,
    disabled: photos.length >= 6,
  });

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    form.setValue('photos', updatedPhotos);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Photos</h3>
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={photo}
                  alt={`Profile photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {photos.length < 6 && (
              <div
                {...getRootProps()}
                className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
              >
                <input {...getInputProps()} />
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell others about yourself..."
                />
              </FormControl>
              <FormDescription>
                Write a short bio that shows your personality
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="NON_BINARY">Non-binary</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <FormField
                    key={interest}
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Button
                            type="button"
                            variant={
                              field.value?.includes(interest)
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => {
                              const newValue = field.value?.includes(
                                interest
                              )
                                ? field.value.filter(
                                    (i) => i !== interest
                                  )
                                : [...(field.value || []), interest];
                              field.onChange(newValue);
                            }}
                          >
                            {interest}
                          </Button>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormDescription>
                Select 3-10 interests that best describe you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy Settings</h3>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="showAge"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Show Age</FormLabel>
                    <FormDescription>
                      Display your age on your profile
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showDistance"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Show Distance</FormLabel>
                    <FormDescription>
                      Show how far away you are from other users
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { EVENT_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/utils';
import { validateEventForm, ValidationError } from '@/lib/validations';
import { EventFormData } from '@/types';

interface EventFormProps {
  initialData?: Partial<EventFormData> & { id?: string; image_url?: string | null };
  onSubmit: (data: EventFormData) => Promise<{ error?: string }>;
  isLoading?: boolean;
}

const categoryOptions = EVENT_CATEGORIES.map((c) => ({ value: c, label: c }));
const difficultyOptions = DIFFICULTY_LEVELS.map((d) => ({
  value: d.value,
  label: d.label,
}));
const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    event_date: initialData?.event_date
      ? new Date(initialData.event_date).toISOString().slice(0, 16)
      : '',
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().slice(0, 16)
      : '',
    category: initialData?.category || '',
    difficulty: initialData?.difficulty || 'all',
    max_participants: initialData?.max_participants || '',
    price: initialData?.price || '0',
    status: initialData?.status || 'draft',
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'La imagen no puede superar 5MB',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateEventForm(formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err: ValidationError) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    const result = await onSubmit(formData);
    if (result.error) {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Información básica</h3>

        <Input
          label="Título del evento"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Ej: Campeonato Regional de Enduro 2024"
          required
        />

        <Textarea
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Describe el evento, recorrido, requisitos..."
          rows={5}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            placeholder="Selecciona categoría"
            error={errors.category}
            required
          />

          <Select
            label="Dificultad"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            options={difficultyOptions}
          />
        </div>
      </div>

      {/* Location & Date */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Ubicación y fechas</h3>

        <Input
          label="Ubicación"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          placeholder="Ej: Sierra de Guadarrama, Madrid"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha de inicio"
            name="event_date"
            type="datetime-local"
            value={formData.event_date}
            onChange={handleChange}
            error={errors.event_date}
            required
          />

          <Input
            label="Fecha de fin (opcional)"
            name="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Participants & Price */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Participantes y precio</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Máximo de participantes (opcional)"
            name="max_participants"
            type="number"
            min="1"
            value={formData.max_participants}
            onChange={handleChange}
            placeholder="Ilimitado si se deja vacío"
          />

          <Input
            label="Precio (€)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            hint="0 para eventos gratuitos"
          />
        </div>
      </div>

      {/* Image */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Imagen del evento</h3>

        {imagePreview ? (
          <div className="relative">
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Haz clic para subir una imagen
            </span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <Select
          label="Estado del evento"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1 sm:flex-none sm:min-w-[120px]">
          {initialData?.id ? 'Guardar cambios' : 'Crear evento'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'El email es obligatorio';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'El email no es válido';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') return `${fieldName} es obligatorio`;
  return null;
}

export function validateEventForm(data: {
  title: string;
  description: string;
  location: string;
  event_date: string;
  category: string;
  price: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateRequired(data.title, 'El título');
  if (titleError) errors.push({ field: 'title', message: titleError });

  const descriptionError = validateRequired(data.description, 'La descripción');
  if (descriptionError) errors.push({ field: 'description', message: descriptionError });

  const locationError = validateRequired(data.location, 'La ubicación');
  if (locationError) errors.push({ field: 'location', message: locationError });

  const dateError = validateRequired(data.event_date, 'La fecha del evento');
  if (dateError) errors.push({ field: 'event_date', message: dateError });

  if (data.event_date && new Date(data.event_date) < new Date()) {
    errors.push({ field: 'event_date', message: 'La fecha del evento debe ser en el futuro' });
  }

  const categoryError = validateRequired(data.category, 'La categoría');
  if (categoryError) errors.push({ field: 'category', message: categoryError });

  if (data.price && isNaN(parseFloat(data.price))) {
    errors.push({ field: 'price', message: 'El precio debe ser un número válido' });
  }

  if (data.price && parseFloat(data.price) < 0) {
    errors.push({ field: 'price', message: 'El precio no puede ser negativo' });
  }

  return errors;
}

export function validateRegisterForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Las contraseñas no coinciden' });
  }

  const nameError = validateRequired(data.fullName, 'El nombre');
  if (nameError) errors.push({ field: 'fullName', message: nameError });

  return errors;
}

import { createClient } from '@supabase/supabase-js'

// 🛑 ВАЖНО: Замени плейсхолдеры ниже на свои реальные ключи!
// Ты нашел их в разделе Settings -> API в твоем проекте Supabase.

const supabaseUrl = 'https://tiefstbvkxmixjfatkuf.supabase.co'; // Пример: https://abcde12345.supabase.co
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZWZzdGJ2a3htaXhqZmF0a3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjEyMzgsImV4cCI6MjA3ODU5NzIzOH0.NIVkyKL4zsL0e1BMuAUDEYHqEgVcsKnLj2rk4rT2hBc'; // Пример: eyJhbGciOiJIUzI1NiI...

// Создаем и экспортируем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
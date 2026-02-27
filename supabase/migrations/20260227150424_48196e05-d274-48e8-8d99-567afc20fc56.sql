
UPDATE public.store_config SET opening_hours = '[
  {"day":"Segunda","open":"10:00","close":"15:30"},
  {"day":"Terça","open":"10:00","close":"15:30"},
  {"day":"Quarta","open":"10:00","close":"15:30"},
  {"day":"Quinta","open":"10:00","close":"15:30"},
  {"day":"Sexta","open":"10:00","close":"15:30"},
  {"day":"Sábado","open":"10:00","close":"15:30"},
  {"day":"Domingo","open":"","close":""}
]'::jsonb;

-- Create messages table for contact form
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages (no auth required)
CREATE POLICY "Anyone can submit contact messages"
ON public.messages
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to view all messages (assuming admins will be added later)
CREATE POLICY "Only admins can view messages"
ON public.messages
FOR SELECT
USING (false);

-- Create index for faster queries
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Add comment
COMMENT ON TABLE public.messages IS 'Stores contact form submissions from the website';
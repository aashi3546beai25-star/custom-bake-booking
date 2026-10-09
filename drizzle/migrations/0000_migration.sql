CREATE TABLE public.cake_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  pickup_date date NOT NULL,
  size text NOT NULL CHECK (size IN ('6 inch','8 inch','10 inch','2-tier')),
  flavor text NOT NULL CHECK (flavor IN ('Vanilla','Chocolate','Red Velvet','Lemon Raspberry','Carrot')),
  design text NOT NULL CHECK (char_length(design) BETWEEN 5 AND 1000),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30)
);

GRANT INSERT ON public.cake_orders TO anon, authenticated;
GRANT ALL ON public.cake_orders TO service_role;

ALTER TABLE public.cake_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place a cake order"
ON public.cake_orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.enforce_cake_capacity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.pickup_date < current_date + 2 THEN
    RAISE EXCEPTION 'Please choose a date at least 2 days from today';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('cake_orders_' || NEW.pickup_date::text));
  IF (SELECT count(*) FROM public.cake_orders WHERE pickup_date = NEW.pickup_date) >= 3 THEN
    RAISE EXCEPTION 'DATE_FULL';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER cake_orders_capacity
BEFORE INSERT ON public.cake_orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_cake_capacity();

CREATE OR REPLACE FUNCTION public.get_full_dates()
RETURNS SETOF date LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT pickup_date FROM public.cake_orders
  WHERE pickup_date >= current_date
  GROUP BY pickup_date HAVING count(*) >= 3
$$;

GRANT EXECUTE ON FUNCTION public.get_full_dates() TO anon, authenticated;
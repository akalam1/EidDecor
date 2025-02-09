-- Create admin authentication table
CREATE TABLE admin_auth (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view admin auth"
  ON admin_auth
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_auth));

CREATE POLICY "Admins can update their own auth"
  ON admin_auth
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_admin_auth_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_admin_auth_updated_at
  BEFORE UPDATE ON admin_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_auth_updated_at();

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_auth 
    WHERE id = user_id
  );
END;
$$ language plpgsql SECURITY DEFINER;

-- Create function to update last login
CREATE OR REPLACE FUNCTION update_admin_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_auth
  SET last_login = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER on_admin_login
  AFTER INSERT OR UPDATE ON admin_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_last_login();
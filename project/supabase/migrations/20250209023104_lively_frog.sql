-- Create admin role
CREATE TABLE admin_roles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view admin roles"
  ON admin_roles
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_roles));

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_roles 
    WHERE id = user_id
  );
END;
$$ language plpgsql SECURITY DEFINER;
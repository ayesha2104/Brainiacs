export const signupUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // TODO: Add user creation logic (hash password, save user, etc.)
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Signup failed' });
    }
  };
  
  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // TODO: Add login logic (verify user, compare password, generate JWT, etc.)
  
      res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };
  
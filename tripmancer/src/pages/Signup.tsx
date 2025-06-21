
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/components/AppLayout';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/components/ui/motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signUp, user, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email for verification.",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordError('');
    clearError();
    
    // Validate password
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Proceed with signup (passing name as metadata)
    await signUp(email, password, { name });
  };
  
  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  }

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthText = ['', 'Weak', 'Medium', 'Strong'];
  const passwordStrengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          className="absolute h-96 w-96 rounded-full bg-purple-300 dark:bg-purple-900/30 blur-3xl opacity-20 top-20 -left-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="absolute h-64 w-64 rounded-full bg-blue-300 dark:bg-blue-900/30 blur-3xl opacity-20 bottom-20 -right-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.div 
          className="absolute h-32 w-32 rounded-full bg-pink-300 dark:bg-pink-900/30 blur-3xl opacity-20 bottom-40 left-40"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
        />

        <div className="w-full max-w-md relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 dark:from-purple-900/40 dark:to-blue-900/40" />
              <div className="px-8 py-10 relative z-10">
                <div className="flex flex-col items-center mb-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: 0.2 
                    }}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3 mb-5 shadow-lg"
                  >
                    <User className="h-7 w-7 text-white" />
                  </motion.div>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Create Account
                    </h1>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Join TripMancer and plan your<br />mood-based adventures today
                    </p>
                  </motion.div>
                </div>
                
                {(error || passwordError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{error || passwordError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" /> Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-lg pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-lg pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all duration-200"
                      />
                      {password && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Password strength:</div>
                            <div className="text-xs font-medium" style={{ color: passwordStrength === 1 ? '#ef4444' : passwordStrength === 2 ? '#eab308' : '#22c55e' }}>
                              {passwordStrengthText[passwordStrength]}
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${passwordStrengthColor[passwordStrength]}`} style={{ width: `${passwordStrength * 33.33}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Confirm Password
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`rounded-lg pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all duration-200 ${
                          confirmPassword && password !== confirmPassword ? 'border-red-500 dark:border-red-500' : ''
                        }`}
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 py-2.5 mt-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign up <ArrowRight className="h-4 w-4 ml-1" />
                        </span>
                      )}
                    </Button>
                  </form>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors">
                      Log in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Signup;

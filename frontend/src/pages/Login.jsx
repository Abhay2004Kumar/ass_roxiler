import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res      = await loginApi(data);
      const redirect = login(res.data.data);
      toast.success(`Welcome back, ${res.data.data.user.name.split(' ')[0]}!`);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><Star size={24} /></div>
          <h1>RateHub</h1>
          <p>Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email Address"
            type="email"
            id="login-email"
            placeholder="you@example.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password with show/hide toggle */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={`form-input has-icon${errors.password ? ' error' : ''}`}
                placeholder="Enter your password"
                {...register('password')}
              />
              <button
                type="button"
                className="form-input-action"
                onClick={() => setShowPw((p) => !p)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="btn-full"
            style={{ marginTop: 6 }}
          >
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

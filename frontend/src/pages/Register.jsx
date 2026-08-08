import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Eye, EyeOff, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Register() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res      = await registerApi(data);
      const redirect = login(res.data.data);
      toast.success('Account created! Welcome to RateHub 🎉');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <p>Create your free account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Full Name"
            type="text"
            id="reg-name"
            placeholder="e.g. Christopher James Nolan (min 20 chars)"
            icon={<User size={15} />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            id="reg-email"
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
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                className={`form-input has-icon${errors.password ? ' error' : ''}`}
                placeholder="8–16 chars, 1 uppercase, 1 special char"
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

          <Input
            label="Address"
            type="text"
            id="reg-address"
            placeholder="123 Main Street, City, Country"
            icon={<MapPin size={15} />}
            error={errors.address?.message}
            {...register('address')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="btn-full"
            style={{ marginTop: 6 }}
          >
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

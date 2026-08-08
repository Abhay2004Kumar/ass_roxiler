import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { changePassword } from '../../api/auth.api';
import { changePasswordSchema } from '../../utils/validators';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [loading,     setLoading]     = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword(data);
      toast.success('Password changed successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ id, label, showState, toggleShow, fieldName, error, placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="form-input-wrapper">
        <span className="form-input-icon"><Lock size={15} /></span>
        <input
          id={id}
          type={showState ? 'text' : 'password'}
          className={`form-input has-icon${error ? ' error' : ''}`}
          placeholder={placeholder}
          {...register(fieldName)}
        />
        <button type="button" className="form-input-action" onClick={toggleShow} tabIndex={-1}>
          {showState ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );

  return (
    <>
      <PageHeader title="Change Password" subtitle="Update your account password securely" />

      <div className="card change-pw-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PasswordField
            id="cp-current"
            label="Current Password"
            showState={showCurrent}
            toggleShow={() => setShowCurrent((p) => !p)}
            fieldName="currentPassword"
            error={errors.currentPassword?.message}
            placeholder="Enter your current password"
          />

          <PasswordField
            id="cp-new"
            label="New Password"
            showState={showNew}
            toggleShow={() => setShowNew((p) => !p)}
            fieldName="newPassword"
            error={errors.newPassword?.message}
            placeholder="8–16 chars, 1 uppercase, 1 special char"
          />

          <p className="password-hint">
            Password requirements: 8–16 characters, at least one uppercase letter (A–Z),
            and at least one special character (!@#$%^&* etc.)
          </p>

          <Button type="submit" variant="primary" loading={loading} style={{ marginTop: 4 }}>
            Update Password
          </Button>
        </form>
      </div>
    </>
  );
}

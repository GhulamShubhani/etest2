import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (emailData) => {
    try {
      const {data} = await axios.post(
        "https://vast-cyan-peacock-toga.cyclic.app/user/sendotp",
        // "http://192.168.1.6:8000/user/sendotp",
        { 
          perpous:"forgetpassword",
          email:emailData.email,
        }
        );
        console.log(data,"data");
      await new Promise((resolve) => setTimeout(resolve, 500));
      sessionStorage.setItem('email-recovery',emailData.email);
      sessionStorage.setItem('otpId-recovery',data.data._id);
      navigate(PATH_AUTH.newPassword);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updatePassword } from '@/lib/password-actions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await updatePassword(data.newPassword, data.currentPassword)
      
      if (result.success) {
        setSuccessMessage('Password changed successfully!')
        reset()
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-foreground">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {successMessage && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500 ml-2">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500 ml-2">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Enter your current password"
              {...register('currentPassword')}
              className="bg-input border-border text-foreground"
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter a new password"
              {...register('newPassword')}
              className="bg-input border-border text-foreground"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Must contain uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...register('confirmPassword')}
              className="bg-input border-border text-foreground"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

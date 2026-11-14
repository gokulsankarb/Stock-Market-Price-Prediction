import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const firstName = profile?.first_name || user.user_metadata?.first_name || 'User'
  const lastName = profile?.last_name || user.user_metadata?.last_name || ''
  const phone = profile?.phone || user.user_metadata?.phone || null
  const createdAt = new Date(user.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">View your account information</p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-3xl">
                {firstName[0]?.toUpperCase()}{lastName[0]?.toUpperCase() || ''}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Free Plan
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Details
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">First Name</p>
              <p className="font-medium">{firstName}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Last Name</p>
              <p className="font-medium">{lastName || '-'}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Mail className="h-4 w-4" />
              <p className="text-sm">Email Address</p>
            </div>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Phone className="h-4 w-4" />
              <p className="text-sm">Phone Number</p>
            </div>
            <p className="font-medium">{phone || 'Not provided'}</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <p className="text-sm">Member Since</p>
            </div>
            <p className="font-medium">{createdAt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Your account security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Your email is verified</p>
              </div>
              <Badge className="bg-success/20 text-success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed at signup</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

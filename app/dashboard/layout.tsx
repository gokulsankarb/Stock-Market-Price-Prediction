import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's first name from metadata or profile
  let firstName = user.user_metadata?.first_name || ''

  if (!firstName) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .single()
    
    firstName = profile?.first_name || 'User'
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar firstName={firstName} />
      <main className="pl-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

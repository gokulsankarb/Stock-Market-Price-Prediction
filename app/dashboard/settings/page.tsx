import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get stocks for default stock selector
  const { data: stocks } = await supabase
    .from('stocks')
    .select('id, symbol, name')
    .eq('is_active', true)
    .order('symbol')

  const defaultSettings = {
    theme: 'dark',
    default_stock_id: null,
    notification_enabled: true,
    chart_type: 'area',
    prediction_days: 7,
  }

  const defaultProfile = {
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    email: user.email || '',
    phone: user.user_metadata?.phone || null,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <SettingsForm
        settings={settings || defaultSettings}
        profile={profile || defaultProfile}
        stocks={stocks || []}
      />
    </div>
  )
}

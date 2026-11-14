'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { NSE_STOCKS } from '@/lib/types'
import { Loader2, Save, Palette, Bell, LineChart, Clock } from 'lucide-react'
import { updateUserSettings, updateProfile } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  settings: {
    theme: string
    default_stock_id: string | null
    notification_enabled: boolean
    chart_type: string
    prediction_days: number
  }
  profile: {
    first_name: string
    last_name: string
    email: string
    phone: string | null
  }
  stocks: { id: string; symbol: string; name: string }[]
}

export function SettingsForm({ settings, profile, stocks }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formSettings, setFormSettings] = useState(settings)
  const [formProfile, setFormProfile] = useState(profile)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    setMessage(null)

    const settingsResult = await updateUserSettings({
      theme: formSettings.theme,
      default_stock_id: formSettings.default_stock_id,
      notification_enabled: formSettings.notification_enabled,
      chart_type: formSettings.chart_type,
      prediction_days: formSettings.prediction_days,
    })

    const profileResult = await updateProfile({
      first_name: formProfile.first_name,
      last_name: formProfile.last_name,
      phone: formProfile.phone || undefined,
    })

    if (settingsResult.error || profileResult.error) {
      setMessage({ type: 'error', text: settingsResult.error || profileResult.error || 'Failed to save' })
    } else {
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {formProfile.first_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  value={formProfile.first_name}
                  onChange={(e) => setFormProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  className="bg-input/50"
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  value={formProfile.last_name}
                  onChange={(e) => setFormProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-input/50"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                value={formProfile.email}
                disabled
                className="bg-muted/50"
              />
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input
                value={formProfile.phone || ''}
                onChange={(e) => setFormProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
                className="bg-input/50"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how StockAI looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select
              value={formSettings.theme}
              onValueChange={(value) => setFormSettings(prev => ({ ...prev, theme: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Chart Type
              </Label>
              <p className="text-sm text-muted-foreground">Default chart visualization</p>
            </div>
            <Select
              value={formSettings.chart_type}
              onValueChange={(value) => setFormSettings(prev => ({ ...prev, chart_type: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="candlestick">Candlestick</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Prediction Settings
          </CardTitle>
          <CardDescription>Configure AI prediction preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Default Stock</Label>
              <p className="text-sm text-muted-foreground">Stock to show on dashboard load</p>
            </div>
            <Select
              value={formSettings.default_stock_id || 'none'}
              onValueChange={(value) => setFormSettings(prev => ({ 
                ...prev, 
                default_stock_id: value === 'none' ? null : value 
              }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (First in list)</SelectItem>
                {stocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.symbol.replace('.NS', '')} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Prediction Days</Label>
              <p className="text-sm text-muted-foreground">Number of days to predict</p>
            </div>
            <Select
              value={formSettings.prediction_days.toString()}
              onValueChange={(value) => setFormSettings(prev => ({ ...prev, prediction_days: parseInt(value) }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Price Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about significant price movements</p>
            </div>
            <Switch
              checked={formSettings.notification_enabled}
              onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, notification_enabled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {message && (
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      <Button onClick={handleSaveSettings} disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  )
}

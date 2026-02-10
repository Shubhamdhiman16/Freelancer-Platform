import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { settingsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Save,
  Loader2,
} from 'lucide-react';

interface SettingValue {
  enabled?: boolean;
  value?: string | number;
  [key: string]: unknown;
}

interface Setting {
  id: string;
  key: string;
  value: SettingValue;
  description?: string;
}

const defaultSettings = {
  email_notifications: { enabled: true },
  platform_name: { value: 'FreelanceHub' },
  maintenance_mode: { enabled: false },
  max_freelancers: { value: 1000 },
  allow_registrations: { enabled: true },
};

export default function Settings() {
  const { role } = useAuth();
  const [settings, setSettings] = useState<Record<string, SettingValue>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isAdmin = role === 'admin';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await settingsApi.getAll();
      if (error) {
        console.error('Error loading settings:', error);
      } else if (data && data.length > 0) {
        const settingsMap: Record<string, SettingValue> = {};
        data.forEach((s: any) => {
          settingsMap[s.key] = s.value as SettingValue;
        });
        setSettings({ ...defaultSettings, ...settingsMap });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Only admins can modify settings');
      return;
    }

    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await settingsApi.set({
          key,
          value: value as Record<string, unknown>,
        });
      }
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, update: Partial<SettingValue>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...update },
    }));
  };

  const settingSections = [
    {
      title: 'General',
      icon: SettingsIcon,
      description: 'Basic platform configuration',
      settings: [
        {
          key: 'platform_name',
          label: 'Platform Name',
          description: 'The name displayed across the platform',
          type: 'text',
        },
        {
          key: 'max_freelancers',
          label: 'Max Freelancers',
          description: 'Maximum number of freelancers allowed',
          type: 'number',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences',
      settings: [
        {
          key: 'email_notifications',
          label: 'Email Notifications',
          description: 'Send email notifications for important events',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Security and access settings',
      settings: [
        {
          key: 'allow_registrations',
          label: 'Allow Registrations',
          description: 'Allow new users to register',
          type: 'toggle',
        },
        {
          key: 'maintenance_mode',
          label: 'Maintenance Mode',
          description: 'Put the platform in maintenance mode',
          type: 'toggle',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleSave}
            className="gradient-primary hover:opacity-90"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </motion.div>

      {/* Settings Sections */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.settings.map((setting, index) => (
                    <div key={setting.key}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">{setting.label}</Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <div>
                          {setting.type === 'toggle' ? (
                            <Switch
                              checked={settings[setting.key]?.enabled ?? false}
                              onCheckedChange={(checked) =>
                                updateSetting(setting.key, { enabled: checked })
                              }
                              disabled={!isAdmin}
                            />
                          ) : setting.type === 'text' ? (
                            <Input
                              value={(settings[setting.key]?.value as string) ?? ''}
                              onChange={(e) =>
                                updateSetting(setting.key, { value: e.target.value })
                              }
                              className="w-48"
                              disabled={!isAdmin}
                            />
                          ) : setting.type === 'number' ? (
                            <Input
                              type="number"
                              value={(settings[setting.key]?.value as number) ?? 0}
                              onChange={(e) =>
                                updateSetting(setting.key, { value: parseInt(e.target.value) || 0 })
                              }
                              className="w-32"
                              disabled={!isAdmin}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Freelancer Platform</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This is a placement project demonstrating a full-stack freelancer management platform
                      with JWT authentication, role-based access control, and complete CRUD operations.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Features:</strong> User Authentication, Freelancer Management, Reports,
                      Admin Panel, Settings, and more.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
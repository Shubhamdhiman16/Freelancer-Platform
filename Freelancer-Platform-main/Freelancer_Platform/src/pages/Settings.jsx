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
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Save,
  Loader2,
} from 'lucide-react';

const defaultSettings = {
  email_notifications: { enabled: true },
  platform_name: { value: 'FreelanceHub' },
  maintenance_mode: { enabled: false },
  max_freelancers: { value: 1000 },
  allow_registrations: { enabled: true },
};

export default function Settings() {
  const { role } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
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
        const settingsMap = {};
        data.forEach((s) => {
          settingsMap[s.key] = s.value;
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
          value: value,
        });
      }
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, update) => {
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
    
      {/* Header */}
      
        
          Settings</h1>
          Configure platform settings and preferences</p>
        </div>
        {isAdmin && (
          
            {saving ? (
              <>
                
                Saving...
              </>
            ) : (
              <>
                
                Save Changes
              </>
            )}
          </Button>
        )}
      </motion.div>

      {/* Settings Sections */}
      {loading ? (
        
          
        </div>
      ) => (
            
              
                
                  
                    
                      
                    </div>
                    
                      {section.title}</CardTitle>
                      {section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                  {section.settings.map((setting, index) => (
                    
                      {index > 0 && }
                      
                        
                          {setting.label}</Label>
                          
                            {setting.description}
                          </p>
                        </div>
                        
                          {setting.type === 'toggle' ? (
                            
                                updateSetting(setting.key, { enabled: checked })
                              }
                              disabled={!isAdmin}
                            />
                          ) : setting.type === 'text' ? (
                            
                                updateSetting(setting.key, { value: e.target.value })
                              }
                              className="w-48"
                              disabled={!isAdmin}
                            />
                          ) : setting.type === 'number' ? (
                            
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
          
            
              
                
                  
                    
                  </div>
                  
                    Freelancer Platform</h3>
                    
                      This is a placement project demonstrating a full-stack freelancer management platform
                      with JWT authentication, role-based access control, and complete CRUD operations.
                    </p>
                    
                      Features:</strong> User Authentication, Freelancer Management, Reports,
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
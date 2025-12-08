import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';

const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, any>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/settings');
      return response.data;
    },
    onSuccess: (data) => {
      const settingsObj: Record<string, any> = {};
      Object.values(data).forEach((setting: any) => {
        settingsObj[setting.key] = setting.value;
      });
      setSettings(settingsObj);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (settingsToUpdate: any[]) => {
      await adminApiClient.put('/admin/settings', { settings: settingsToUpdate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings updated');
    },
  });

  const handleSave = () => {
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      type: 'string',
    }));
    updateMutation.mutate(settingsArray);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data && Object.values(data).map((setting: any) => (
            <div key={setting.key} className="space-y-2">
              <Label htmlFor={setting.key}>{setting.key}</Label>
              <Input
                id={setting.key}
                value={settings[setting.key] || ''}
                onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                placeholder={setting.description || ''}
              />
            </div>
          ))}
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;


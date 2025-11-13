import { Switch } from './Switch';

export const PrivacySettings = ({ settings, onChange }: { settings: Record<string, boolean>; onChange: (key: string, value: boolean) => void }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span>Public Profile</span>
      <Switch checked={settings.publicProfile} onChange={(checked) => onChange('publicProfile', checked)} />
    </div>
    <div className="flex items-center justify-between">
      <span>Show Email</span>
      <Switch checked={settings.showEmail} onChange={(checked) => onChange('showEmail', checked)} />
    </div>
    <div className="flex items-center justify-between">
      <span>Show Activity</span>
      <Switch checked={settings.showActivity} onChange={(checked) => onChange('showActivity', checked)} />
    </div>
  </div>
);


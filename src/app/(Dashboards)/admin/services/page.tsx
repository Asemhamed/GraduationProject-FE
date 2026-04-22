'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle, Cloud, Database, Mail, Lock, Badge } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'inactive' | 'warning'
  lastChecked: string
}

const services: Service[] = [
  {
    id: '1',
    name: 'Cloud Storage',
    description: 'Manage your cloud storage and files',
    icon: <Cloud className="w-8 h-8 text-blue-500" />,
    status: 'active',
    lastChecked: '2 minutes ago',
  },
  {
    id: '2',
    name: 'Database',
    description: 'Database management and backups',
    icon: <Database className="w-8 h-8 text-purple-500" />,
    status: 'active',
    lastChecked: '1 minute ago',
  },
  {
    id: '3',
    name: 'Email Service',
    description: 'Email configuration and templates',
    icon: <Mail className="w-8 h-8 text-green-500" />,
    status: 'warning',
    lastChecked: '5 minutes ago',
  },
  {
    id: '4',
    name: 'Security',
    description: 'Security settings and authentication',
    icon: <Lock className="w-8 h-8 text-red-500" />,
    status: 'active',
    lastChecked: 'Just now',
  },
]

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
  warning: { label: 'Warning', className: 'bg-yellow-100 text-yellow-800' },
}

export default function Services() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Services</h2>
        <p className="text-muted-foreground">
          Manage and monitor all your services in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
              <Badge
                className={`ml-2 ${statusConfig[service.status].className}`}
              >
                {service.status === 'active' && <Check size={14} className="mr-1" />}
                {service.status === 'warning' && (
                  <AlertCircle size={14} className="mr-1" />
                )}
                {statusConfig[service.status].label}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-xs text-muted-foreground">
                Last checked: {service.lastChecked}
              </p>
              <Button
                onClick={() =>
                  setExpanded(expanded === service.id ? null : service.id)
                }
                variant="outline"
                size="sm"
              >
                {expanded === service.id ? 'Hide' : 'Details'}
              </Button>
            </div>

            {expanded === service.id && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Status Details
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      {service.status === 'active'
                        ? 'Service is running normally'
                        : service.status === 'inactive'
                          ? 'Service is currently offline'
                          : 'Service requires attention'}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="default">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

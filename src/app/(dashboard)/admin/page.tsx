'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, Users, FileImage, Settings, CreditCard, 
  Trash2, ShieldCheck, Download, Search, Server
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const DarkVeil = dynamic(() => import('@/components/ui/DarkVeil'), { ssr: false });

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 1420, totalUploads: 12450, totalAnalyses: 12400 });

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden opacity-50 mix-blend-screen pointer-events-none">
        <DarkVeil
          hueShift={280} // Shift to purple/indigo spectrum
          noiseIntensity={0.08}
          scanlineIntensity={0.2}
          speed={0.4}
          scanlineFrequency={4.0}
          warpAmount={0.3}
        />
      </div>
      <div className="relative z-10 space-y-8 max-w-7xl mx-auto pb-12 pt-6 px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
            Admin Console
          </h1>
          <p className="text-zinc-400 mt-1">Global platform management and user administration.</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl">
          <Download className="mr-2 h-4 w-4" /> Export Global Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="uploads">Global Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-zinc-950 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total Users</CardTitle>
                <Users className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total Scans</CardTitle>
                <FileImage className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUploads.toLocaleString()}</div>
                <p className="text-xs text-emerald-400 mt-1">+24% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Server Load</CardTitle>
                <Server className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">42%</div>
                <p className="text-xs text-zinc-500 mt-1">Normal operating levels</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">842</div>
                <p className="text-xs text-emerald-400 mt-1">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-950/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">System Status</CardTitle>
              <CardDescription>Real-time platform metrics and edge inference latency.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
                 <p className="text-zinc-500 flex items-center gap-2"><Activity className="h-4 w-4" /> Monitoring connection established. All systems nominal.</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-zinc-950 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription>View and manage all registered accounts on NovaWeave.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input type="text" placeholder="Search users by email or ID..." className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { email: 'admin@threadcounty.com', role: 'Admin', date: '2025-01-10' },
                        { email: 'user@fabriccorp.com', role: 'Professional', date: '2025-02-14' },
                        { email: 'qc@loomandthread.com', role: 'Enterprise', date: '2025-03-01' },
                        { email: 'student@university.edu', role: 'Student', date: '2025-04-22' }
                      ].map((u, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{u.email}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs border border-indigo-500/20">{u.role}</span></td>
                          <td className="px-4 py-3 text-zinc-400">{u.date}</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card className="bg-zinc-950 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Subscription Plans</CardTitle>
              <CardDescription>Manage active subscriptions and billing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Plan</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">MRR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { customer: 'FabricCorp Ltd', plan: 'Enterprise', status: 'Active', mrr: '$4,999' },
                        { customer: 'user@fabriccorp.com', plan: 'Professional', status: 'Active', mrr: '$49' },
                        { customer: 'QC Team A', plan: 'Professional', status: 'Past Due', mrr: '$49' }
                      ].map((s, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{s.customer}</td>
                          <td className="px-4 py-3 text-zinc-300">{s.plan}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs border ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{s.status}</span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{s.mrr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="uploads">
          <Card className="bg-zinc-950 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Global Uploads & Reports</CardTitle>
              <CardDescription>Monitor all recent platform activity across all tenants.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 text-center">
                 <FileImage className="h-8 w-8 text-zinc-600 mb-4" />
                 <p className="text-zinc-400 font-medium">Global feed is currently empty.</p>
                 <p className="text-xs text-zinc-500">Wait for users to begin processing fabrics.</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
      </div>
    </div>
  );
}

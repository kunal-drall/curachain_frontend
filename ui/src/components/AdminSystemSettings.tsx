
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Settings, Shield, Server, Wallet, LockKeyhole, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";

const AdminSystemSettings = () => {
  const form = useForm({
    defaultValues: {
      minVerifiers: 3,
      maxCaseAmount: 50,
      blockchainNetwork: "mainnet",
      autoApproval: false,
      maintenanceMode: false,
      enforceKYC: true,
      newUserRestrictions: true,
    }
  });

  const onSubmit = (data: any) => {
    console.log("Settings updated:", data);
    // In a real app, this would save to the backend
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Global platform settings and parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verification Settings
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="minVerifiers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Verifiers Required</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} max={10} />
                        </FormControl>
                        <FormDescription>
                          Number of medical professionals required to verify each case
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="autoApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Automatic Approval</FormLabel>
                          <FormDescription>
                            Automatically approve cases when majority threshold is reached
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Financial Settings
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="maxCaseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Case Amount (SOL)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} />
                        </FormControl>
                        <FormDescription>
                          Maximum amount that can be requested in a single case
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="blockchainNetwork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blockchain Network</FormLabel>
                        <div className="relative">
                          <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="mainnet">Mainnet</option>
                            <option value="testnet">Testnet</option>
                            <option value="devnet">Devnet</option>
                          </select>
                        </div>
                        <FormDescription>
                          Active blockchain network for transactions
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4" />
                  Security Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enforceKYC"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enforce KYC Verification</FormLabel>
                          <FormDescription>
                            Require identity verification for all users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newUserRestrictions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>New User Restrictions</FormLabel>
                          <FormDescription>
                            Apply limitations to newly registered accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <FormDescription>
                        Temporarily disable user access for system maintenance
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Platform operation metrics and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="text-muted-foreground text-sm">Database</div>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="font-medium">Operational</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="text-muted-foreground text-sm">Blockchain</div>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="font-medium">Connected</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="text-muted-foreground text-sm">API Services</div>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="font-medium">All Operational</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">System Load</div>
                <div className="text-sm text-muted-foreground">24%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Storage Capacity</div>
                <div className="text-sm text-muted-foreground">67%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            View Public Status Page
          </Button>
          <Button variant="default">Run Diagnostics</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSystemSettings;

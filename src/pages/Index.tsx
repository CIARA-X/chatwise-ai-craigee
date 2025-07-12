
import { useState, useEffect } from 'react';
import { Bot, MessageCircle, Zap, Moon, Sun, Smartphone, Activity, Users, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [showPairCode, setShowPairCode] = useState(false);
  const [botStatus, setBotStatus] = useState<'offline' | 'generating' | 'waiting' | 'online'>('offline');
  const [darkMode, setDarkMode] = useState(false);
  const [activeMode, setActiveMode] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messageCount, setMessageCount] = useState(247);
  const [groupsCount, setGroupsCount] = useState(12);

  // Railway backend URL - update this with your Railway deployment URL
  const BACKEND_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-railway-app.railway.app' 
    : 'http://localhost:3001';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleGeneratePairCode = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your WhatsApp phone number",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    setBotStatus('generating');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setPairCode(data.pairCode);
        setShowPairCode(true);
        setBotStatus('waiting');
        toast({
          title: "Pair Code Generated! 🎉",
          description: "Enter this code in WhatsApp to link your account",
        });
        
        // Start polling for connection status
        pollConnectionStatus();
      } else {
        throw new Error(data.error || 'Failed to generate pair code');
      }
    } catch (error) {
      setBotStatus('offline');
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate pair code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const pollConnectionStatus = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/status`);
        const data = await response.json();
        
        if (data.connected) {
          setBotStatus('online');
          clearInterval(interval);
          toast({
            title: "Bot Connected! 🚀",
            description: "CraigeeX WhatsApp Bot is now online and ready to respond!",
          });
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 3000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  };

  const handleToggleActiveMode = async () => {
    if (botStatus !== 'online') return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/toggle-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !activeMode }),
      });

      if (response.ok) {
        setActiveMode(!activeMode);
        toast({
          title: activeMode ? "Bot Silenced" : "Bot Activated",
          description: activeMode ? "Bot will not respond to messages" : "Bot is now responding to messages",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle bot mode",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = () => {
    switch (botStatus) {
      case 'online': return 'bg-green-500';
      case 'waiting': return 'bg-blue-500 animate-pulse';
      case 'generating': return 'bg-yellow-500 animate-pulse';
      case 'offline': return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (botStatus) {
      case 'online': return 'Online';
      case 'waiting': return 'Waiting for Link';
      case 'generating': return 'Generating Code...';
      case 'offline': return 'Offline';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CraigeeX Bot</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">WhatsApp ChatGPT Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={botStatus === 'online' ? 'default' : 'secondary'} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                <span>{getStatusText()}</span>
              </Badge>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Phone Number & Pair Code Panel */}
          <Card className="md:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <CardTitle>Connect WhatsApp Bot</CardTitle>
              </div>
              <CardDescription>
                Enter your WhatsApp number to generate a pair code, then link your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPairCode ? (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Enter WhatsApp Number (e.g., +27847826044)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isConnecting}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={handleGeneratePairCode}
                      disabled={isConnecting}
                      className="px-6"
                    >
                      {isConnecting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        'Generate Code'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Your Pair Code
                    </h3>
                    <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4 select-all">
                      {pairCode}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <p>1. Open WhatsApp on your phone</p>
                      <p>2. Go to Linked Devices → Link a Device</p>
                      <p>3. Select "Link with phone number instead"</p>
                      <p>4. Enter the code above</p>
                    </div>
                  </div>
                  
                  {botStatus === 'waiting' && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                          Waiting for you to link your WhatsApp account...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {botStatus === 'online' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Bot is active and monitoring messages
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bot Controls */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Bot Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bot responds to messages
                  </p>
                </div>
                <Switch
                  checked={activeMode}
                  onCheckedChange={handleToggleActiveMode}
                  disabled={botStatus !== 'online'}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner Info</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">CraigeeX</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">+27847826044</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span>Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{messageCount.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total processed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Groups</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{groupsCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active groups</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Uptime</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {botStatus === 'online' ? '24h 15m' : '0h 0m'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current session</p>
            </CardContent>
          </Card>

          {/* Features Panel */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>🤖 Smart Features</CardTitle>
              <CardDescription>
                CraigeeX Bot comes with advanced AI capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Context-Aware Responses</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Group & Private Chats</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Message History Analysis</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Personalized Advice</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>CraigeeX WhatsApp Bot Dashboard • Built with ❤️ using React & Railway</p>
            <p className="mt-1">Backend: Railway • Frontend: Vercel • AI: OpenAI GPT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

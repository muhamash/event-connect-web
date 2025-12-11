import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  BarChart3,
  Activity,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import { mockUsers, mockEvents } from "@/data/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [userSearch, setUserSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");

  // Mock analytics data
  const monthlyData = [
    { month: "Jan", users: 120, events: 45, revenue: 2400 },
    { month: "Feb", users: 180, events: 62, revenue: 3100 },
    { month: "Mar", users: 250, events: 78, revenue: 4200 },
    { month: "Apr", users: 310, events: 95, revenue: 5100 },
    { month: "May", users: 420, events: 112, revenue: 6800 },
    { month: "Jun", users: 580, events: 145, revenue: 8900 },
  ];

  const categoryData = [
    { name: "Music", value: 35, color: "hsl(var(--primary))" },
    { name: "Tech", value: 25, color: "hsl(var(--secondary))" },
    { name: "Sports", value: 20, color: "hsl(var(--accent))" },
    { name: "Food", value: 12, color: "hsl(var(--muted))" },
    { name: "Art", value: 8, color: "hsl(var(--destructive))" },
  ];

  const recentActivity = [
    { id: 1, action: "New user registered", user: "John Doe", time: "2 mins ago", type: "user" },
    { id: 2, action: "Event created", user: "Sarah Smith", time: "15 mins ago", type: "event" },
    { id: 3, action: "Payment received", user: "Mike Johnson", time: "1 hour ago", type: "payment" },
    { id: 4, action: "Event reported", user: "Anonymous", time: "2 hours ago", type: "report" },
    { id: 5, action: "User verified", user: "Emily Brown", time: "3 hours ago", type: "user" },
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || 
      (userRoleFilter === "host" && user.isHost) ||
      (userRoleFilter === "user" && !user.isHost);
    return matchesSearch && matchesRole;
  });

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      event.host.toLowerCase().includes(eventSearch.toLowerCase());
    const matchesStatus = eventStatusFilter === "all" || event.status === eventStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Events",
      value: "156",
      change: "+8.2%",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: "$48,290",
      change: "+23.1%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      icon: TrendingUp,
      trend: "down",
    },
  ];

  const chartConfig = {
    users: { label: "Users", color: "hsl(var(--primary))" },
    events: { label: "Events", color: "hsl(var(--secondary))" },
    revenue: { label: "Revenue", color: "hsl(var(--accent))" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div {...fadeInUp} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage users, events, and view platform analytics</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary text-primary">
              <Shield className="h-4 w-4 mr-1" />
              Administrator
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          {...fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all registered users and their roles</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-9 bg-background border-border w-64"
                      />
                    </div>
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger className="w-32 bg-background border-border">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">Users</SelectItem>
                        <SelectItem value="host">Hosts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isHost ? "default" : "secondary"} className={user.isHost ? "bg-primary" : ""}>
                            {user.isHost ? "Host" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.location}</TableCell>
                        <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Make Host
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Event Moderation</CardTitle>
                    <CardDescription>Review and moderate all platform events</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events..."
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        className="pl-9 bg-background border-border w-64"
                      />
                    </div>
                    <Select value={eventStatusFilter} onValueChange={setEventStatusFilter}>
                      <SelectTrigger className="w-32 bg-background border-border">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Event</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-10 w-14 object-cover rounded"
                            />
                            <span className="font-medium text-foreground">{event.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.hostAvatar} alt={event.host} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {event.host.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground">{event.host}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{event.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{event.date}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {event.attendees}/{event.maxAttendees}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              event.status === "open"
                                ? "border-green-500 text-green-500"
                                : event.status === "full"
                                ? "border-blue-500 text-blue-500"
                                : event.status === "completed"
                                ? "border-muted-foreground text-muted-foreground"
                                : "border-red-500 text-red-500"
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Flag for Review
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Growth Chart */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Platform Growth
                  </CardTitle>
                  <CardDescription>Monthly user and event growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="events"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--secondary))" }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Event Categories
                  </CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-muted-foreground">{cat.name}</span>
                        </div>
                        <span className="text-foreground font-medium">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>Monthly revenue from event fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest platform actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === "user" ? "bg-blue-500/10" :
                          activity.type === "event" ? "bg-green-500/10" :
                          activity.type === "payment" ? "bg-primary/10" :
                          "bg-red-500/10"
                        }`}>
                          {activity.type === "user" && <Users className="h-4 w-4 text-blue-500" />}
                          {activity.type === "event" && <Calendar className="h-4 w-4 text-green-500" />}
                          {activity.type === "payment" && <DollarSign className="h-4 w-4 text-primary" />}
                          {activity.type === "report" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

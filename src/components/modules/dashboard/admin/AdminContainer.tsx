"use client";

import { getAllEvents, getAllParticipants, getAllUsers } from "@/lib/services/admin/admin.service";
import
    {
        Calendar,
        ChevronLeft,
        ChevronRight,
        Eye,
        Search,
        Settings,
        Shield,
        TrendingUp,
        UserCheck,
        Users,
        XCircle
    } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userRole: "",
    eventStatus: "",
    searchQuery: "",
  } );
    
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

    const router = useRouter();

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "events") loadEvents();
    if (activeTab === "participants") loadParticipants();
  }, [activeTab, pagination.page, filters]);

  /** Load Overview Stats */
  const loadStats = async () => {
    setLoading(true);
    try {

      const usersRes = await getAllUsers(1, 1); 
      const eventsRes = await getAllEvents(1, 1); 
      const participantsRes = await getAllParticipants(1, 1); 

      setStats({
        totalUsers: usersRes.data?.pagination?.total || 0,
        totalHosts:
          (usersRes.data?.users?.filter((u) => u.role === "HOST")?.length) || 0,
        totalEvents: eventsRes.data?.pagination?.total || 0,
        completedEvents:
          (eventsRes.data?.events?.filter((e) => e.status === "COMPLETED")
            ?.length) || 0,
        ongoingEvents:
          (eventsRes.data?.events?.filter((e) => e.status === "OPEN")?.length) ||
          0,
        totalParticipants: participantsRes.data?.pagination?.total || 0,
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  /** Load Users */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(
        pagination.page,
        pagination.limit,
        filters.userRole || undefined
      );

      if (res.success) {
        // Apply search filter on fullname/email client-side
        const searchFiltered = res.data.users.filter(
          (u) =>
            u.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

        setUsers(searchFiltered);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  /** Load Events */
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await getAllEvents(
        pagination.page,
        pagination.limit,
        filters.eventStatus || undefined
      );
      if (res.success) {
        setEvents(res.data.events);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  /** Load Participants */
  const loadParticipants = async () => {
    setLoading(true);
    try {
      const res = await getAllParticipants(pagination.page, pagination.limit);
      if (res.success) {
        setParticipants(res.data.participants);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      console.error("Failed to load participants", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, gradient }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-amber-400" />
      </div>
      <div className="text-3xl font-bold text-amber-400 mb-1">{value}</div>
      <div className="text-sm text-gray-300">{label}</div>
      {subtext && <div className="text-xs text-gray-500 mt-2">{subtext}</div>}
    </div>
  );

  const UserModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-400">User Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-amber-400 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullname?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.fullname}</h3>
              <p className="text-gray-400">{user?.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                user?.role === "ADMIN" ? "bg-red-900 text-red-300" :
                user?.role === "HOST" ? "bg-amber-900 text-amber-300" :
                "bg-green-900 text-green-300"
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Rating</div>
              <div className="text-2xl font-bold text-amber-400">{user?.rating || 0} ⭐</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Events</div>
              <div className="text-2xl font-bold text-amber-400">{user?.eventsAttended || user?.eventsHosted || 0}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold">
              Change Role
            </button>
            <button className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
              View Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  py-20">
      {/* Header */}
      <div className=" border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                <Shield className="w-8 h-8 text-amber-500" />
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage and monitor platform activity</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className=" sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "users", label: "Users", icon: Users },
              { id: "events", label: "Events", icon: Calendar },
              { id: "participants", label: "Participants", icon: UserCheck }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-gray-400 hover:text-amber-300"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats?.totalUsers || 0}
                subtext="Active platform members"
                gradient="from-amber-500 to-orange-600"
              />
              
              <StatCard
                icon={Calendar}
                label="Total Events"
                value={stats?.totalEvents || 0}
                subtext="All time events"
                gradient="from-yellow-500 to-amber-600"
              />
              

              <StatCard
                icon={UserCheck}
                label="Total Participants"
                value={stats?.totalParticipants || 0}
                subtext="Event attendees"
                gradient="from-amber-500 to-yellow-600"
              />
            </div>

            
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500"
                    onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                  />
                </div>
                <select
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  onChange={(e) => setFilters(f => ({ ...f, userRole: e.target.value }))}
                >
                  <option value="">All Roles</option>
                  <option value="USER">Users</option>
                  <option value="HOST">Hosts</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Role</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">total participation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.fullname.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-200">{user.fullname}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "ADMIN" ? "bg-red-900 text-red-300" :
                            user.role === "HOST" ? "bg-amber-900 text-amber-300" :
                            "bg-green-900 text-green-300"
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-300">{user.eventsAttended || user.eventsHosted || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/profile?userId=${user?.id}`)}
                            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between bg-gray-900">
                <div className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500"
                  />
                </div>
                <select
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  onChange={(e) => setFilters(f => ({ ...f, eventStatus: e.target.value }))}
                >
                  <option value="">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="FULL">Full</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-400 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Host: <span className="text-gray-300">{event.host.fullname}</span></span>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "OPEN" ? "bg-green-900 text-green-300" :
                      event.status === "COMPLETED" ? "bg-blue-900 text-blue-300" :
                      event.status === "CANCELLED" ? "bg-red-900 text-red-300" :
                      "bg-orange-900 text-orange-300"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <UserCheck className="w-5 h-5" />
                      <span className="text-sm">{event._count.participants} participants</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-gray-400">
                      <Award className="w-5 h-5" />
                      <span className="text-sm">{event._count.reviews} reviews</span>
                    </div> */}
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/events/${event?.id}`} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold">
                      View Details
                    </Link>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === "participants" && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {participants.map(participant => (
                    <tr key={participant.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                            {participant.user.fullname.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">{participant.user.fullname}</div>
                            <div className="text-sm text-gray-500">{participant.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">{participant.event.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          participant.event.status === "OPEN" ? "bg-green-900 text-green-300" :
                          "bg-blue-900 text-blue-300"
                        }`}>
                          {participant.event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(participant.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
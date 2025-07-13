import React from 'react';
import UserAvatar from './UserAvatar';
import { Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">
          Online ({users.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3">
            <UserAvatar 
              name={user.name} 
              avatar={user.avatar} 
              size="sm" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
                {user.id === currentUserId && (
                  <span className="text-xs text-gray-500 ml-1">(You)</span>
                )}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;